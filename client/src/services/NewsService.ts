import { $api, API_URL } from '../http';
import { NewsResponse } from '../models/response/NewsResponse';

export default class NewsService {
  static async getNews() {
    const response = await $api.get<NewsResponse[]>(`${API_URL}/news`);
    return response;
  }

  static async createNews(newsData: object) {
    const response = await $api.post<NewsResponse>(`${API_URL}/news`, newsData);
    return response;
  }

  static async updateNews(id: string, newsData: object) {
    const response = await $api.put<NewsResponse>(`${API_URL}/news/${id}`, newsData);
    return response;
  }

  static async deleteNews(id: string) {
    const response = await $api.delete(`${API_URL}/news/${id}`);
    return response;
  }
}
