// controllers/news-controller.js
const NewsModel = require('../models/news-model');
const ApiError = require('../exceptions/api-error');

class NewsController {
    async getNews(req, res, next) {
        try {
            const news = await NewsModel.find().sort({ date: -1 });
            return res.json(news);
        } catch (error) {
            next(error);
        }
    }

    async createNews(req, res, next) {
        try {
            const { title, content, imageUrl } = req.body;
            const news = await NewsModel.create({ title, content, imageUrl });
            return res.json(news);
        } catch (error) {
            next(error);
        }
    }

    async updateNews(req, res, next) {
        try {
            const { id } = req.params;
            const { title, content, imageUrl } = req.body;

            const news = await NewsModel.findByIdAndUpdate(
                id,
                { title, content, imageUrl },
                { new: true }
            );

            if (!news) {
                throw ApiError.NotFound('Новость не найдена');
            }

            return res.json(news);
        } catch (error) {
            next(error);
        }
    }

    async deleteNews(req, res, next) {
        try {
            const { id } = req.params;
            const news = await NewsModel.findByIdAndDelete(id);

            if (!news) {
                throw ApiError.NotFound('Новость не найдена');
            }

            return res.json({ message: 'Новость успешно удалена' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NewsController();