import {$api} from '../http';

export default class NewsService {
    static async getAllNews(isEvent) {
        const response = await $api.get('/news', { params: { isEvent } });
        return response.data;
    }

    static async getNewsById(id) {
        const response = await $api.get(`/news/${id}`);
        return response.data;
    }

    static async createNews(newsData) {
        const response = await $api.post('/news', newsData);
        return response.data;
    }

    static async updateNews(id, newsData) {
        const response = await $api.put(`/news/${id}`, newsData);
        return response.data;
    }

    static async deleteNews(id) {
        const response = await $api.delete(`/news/${id}`);
        return response.data;
    }
} 