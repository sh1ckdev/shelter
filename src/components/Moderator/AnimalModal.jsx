import { useState, useEffect } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const AnimalModal = ({ isOpen, onClose, onSave, initialData }) => {
  // Определяем режим: редактирование или добавление
  const isEditMode = !!initialData;

  // Состояние формы
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    description: "",
    imageUrl: "",
  });

  // Состояние ошибки
  const [error, setError] = useState("");

  // Состояние для загруженного файла
  const [imageFile, setImageFile] = useState(null);

  // Инициализация формы при изменении initialData
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || "",
        species: initialData.species || "",
        breed: initialData.breed || "",
        age: initialData.age || "",
        gender: initialData.gender || "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        species: "",
        breed: "",
        age: "",
        gender: "",
        description: "",
        imageUrl: "",
      });
      setImageFile(null); // Очищаем файл при создании нового животного
    }
  }, [initialData, isEditMode]);

  // Обработчик изменений полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) }); // Показываем предварительный просмотр
    }
  };

  // Обработчик сохранения
  const handleSave = () => {
    if (!formData.name || !formData.species || !formData.age || !formData.gender) {
      setError("Пожалуйста, заполните обязательные поля");
      return;
    }

    // Создаем объект FormData для отправки файла
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("species", formData.species);
    dataToSend.append("breed", formData.breed);
    dataToSend.append("age", formData.age);
    dataToSend.append("gender", formData.gender);
    dataToSend.append("description", formData.description);
    if (imageFile) {
      dataToSend.append("image", imageFile); // Добавляем файл
    } else if (formData.imageUrl) {
      dataToSend.append("imageUrl", formData.imageUrl); // Если файл не выбран, отправляем старую ссылку
    }

    onSave(dataToSend); // Передаем FormData в onSave
    onClose();
  };

  // Если модальное окно закрыто, не отображаем его
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out">
        {/* Заголовок и кнопка закрытия */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between relative">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Редактировать животное" : "Добавить новое животное"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors absolute top-4 right-4"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {/* Основное содержимое */}
        <div className="p-6">
          {/* Поля для редактирования */}
          <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
          <div className="w-1/2 flex justify-center items-center">
    {formData.imageUrl && (
      <div className="w-24 h-24 rounded-lg overflow-hidden">
        <img
          src={formData.imageUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
  <div className="w-2/1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Изображение
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
    />
  </div>

</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Введите имя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вид
              </label>
              <input
                type="text"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Введите вид"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Порода
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Введите породу"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Возраст
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Введите возраст"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пол
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Выберите пол</option>
                <option value="Мужской">Мужской</option>
                <option value="Женский">Женский</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Введите описание"
              />
            </div>
          </div>
          {/* Сообщение об ошибке */}
          {error && (
            <div className="mt-4 text-sm text-red-500 text-center">{error}</div>
          )}
          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              {isEditMode ? "Сохранить изменения" : "Добавить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Пропсы
AnimalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    species: PropTypes.string,
    breed: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
};

export default AnimalModal;