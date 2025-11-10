const News = require('../models/news.model');
const ApiError = require('../exceptions/api-error');

class NewsController {
    async create(req, res, next) {
        try {
            const news = await News.create(req.body);
            return res.json(news);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const { isEvent } = req.query;
            const filter = {};
            if (isEvent !== undefined) {
                filter.isEvent = isEvent === 'true';
            }
            const news = await News.find(filter).sort({ date: -1 });
            return res.json(news);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const news = await News.findById(id);
            if (!news) {
                throw ApiError.BadRequest('Новость не найдена');
            }
            return res.json(news);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const news = await News.findByIdAndUpdate(id, req.body, { new: true });
            if (!news) {
                throw ApiError.BadRequest('Новость не найдена');
            }
            return res.json(news);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const news = await News.findByIdAndDelete(id);
            if (!news) {
                throw ApiError.BadRequest('Новость не найдена');
            }
            return res.json(news);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new NewsController(); 