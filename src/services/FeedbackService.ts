import { $api, API_URL } from '../http';
import { FeedbackResponse } from '../models/response/FeedbackResponse';

export default class FeedbackService {
  static async createFeedback(feedbackData: object) {
    const response = await $api.post<FeedbackResponse>(`${API_URL}/feedback`, feedbackData);
    return response;
  }

  static async getFeedback() {
    const response = await $api.get<FeedbackResponse[]>(`${API_URL}/feedback`);
    return response;
  }
}
