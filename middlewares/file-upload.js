// middleware/file-upload.js
const multer = require('multer');
const path = require('path');

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/'); // Папка для сохранения файлов
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Генерация уникального имени файла
    }
});

// Фильтр для разрешенных типов файлов
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Принимаем только изображения
    } else {
        cb(new Error('Только изображения разрешены!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Ограничение размера файла до 5 МБ
});

module.exports = upload;