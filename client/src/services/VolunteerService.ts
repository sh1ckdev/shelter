import { $api, API_URL } from '../http';
import { VolunteerResponse } from '../models/response/VolunteerResponse';

export default class VolunteerService {
  static async registerVolunteer(volunteerData: object) {
    const response = await $api.post<VolunteerResponse>(`${API_URL}/volunteers`, volunteerData);
    return response;
  }

  static async updateVolunteerStatus(id: string, status: string) {
    const response = await $api.put<VolunteerResponse>(`${API_URL}/volunteers/${id}/status`, { status });
    return response;
  }

  static async deleteVolunteer(id: string) {
    const response = await $api.delete(`${API_URL}/volunteers/${id}`);
    return response;
  }
}
