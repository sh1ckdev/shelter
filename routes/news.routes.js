const Router = require('express').Router;
const newsController = require('../controllers/news.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = new Router();

// Публичные роуты
router.get('/', newsController.getAll);
router.get('/:id', newsController.getOne);

// Защищенные роуты (только для админа)
router.post('/', authMiddleware, newsController.create);
router.put('/:id', authMiddleware, newsController.update);
router.delete('/:id', authMiddleware, newsController.delete);

module.exports = router; 