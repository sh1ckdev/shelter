// services/news-service.js
const NewsModel = require('../models/news-model');
const ApiError = require('../exceptions/api-error');

class NewsService {
    async getNews() {
        const news = await NewsModel.find().sort({ date: -1 });
        return news;
    }

    async createNews(title, content, imageUrl) {
        const news = await NewsModel.create({ title, content, imageUrl });
        return news;
    }

    async updateNews(id, title, content, imageUrl) {
        const news = await NewsModel.findByIdAndUpdate(
            id,
            { title, content, imageUrl },
            { new: true }
        );

        if (!news) {
            throw ApiError.NotFound('Новость не найдена');
        }

        return news;
    }

    async deleteNews(id) {
        const news = await NewsModel.findByIdAndDelete(id);

        if (!news) {
            throw ApiError.NotFound('Новость не найдена');
        }

        return { message: 'Новость успешно удалена' };
    }
}

module.exports = new NewsService();