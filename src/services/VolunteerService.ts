import { $api, API_URL } from '../http';
import { VolunteerResponse } from '../models/response/VolunteerResponse';

interface VolunteerData {
  userId: string;
  email: string;
  username: string;
  role: string;
  tasks?: string[]; 
  schedule?: string[]; 
}

export default class VolunteerService {
  static async applyForVolunteer(volunteerData: VolunteerData) {
    const response = await $api.post<VolunteerResponse>(`${API_URL}/volunteers/apply`, volunteerData);
    return response;
}

  static async approveVolunteer(id: string) {
    const response = await $api.patch<VolunteerResponse>(`${API_URL}/volunteers/${id}/approve`);
    return response;
  }

  static async rejectVolunteer(id: string) {
    const response = await $api.patch<VolunteerResponse>(`${API_URL}/volunteers/${id}/reject`);
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

  static async getVolunteers() {
    const response = await $api.get<VolunteerResponse[]>(`${API_URL}/volunteers`);
    return response;
  }

  static async checkApplicationStatus(userId: string) {
    const response = await $api.get(`${API_URL}/volunteers/status/${userId}`);
    return response;
  }
}