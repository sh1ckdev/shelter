import { $api, API_URL } from '../http';
import { AnimalResponse } from '../models/response/AnimalResponse';

export default class AnimalService {
  static async getAnimals() {
    const response = await $api.get<AnimalResponse>(`${API_URL}/animals`);
    return response;
  }

  static async getAnimalById(id: string) {
    const response = await $api.get<AnimalResponse>(`${API_URL}/animals/${id}`);
    return response;
  }

  static async getAnimalsByFilters(filters: object) {
    const response = await $api.get<AnimalResponse>(`${API_URL}/animals/filter`, { params: filters });
    return response;
  }

  static async createAnimal(animalData: object) {
    const response = await $api.post<AnimalResponse>(`${API_URL}/animals`, animalData);
    return response;
  }

  static async updateAnimal(id: string, animalData: object) {
    const response = await $api.put<AnimalResponse>(`${API_URL}/animals/${id}`, animalData);
    return response;
  }

  static async deleteAnimal(id: string) {
    const response = await $api.delete(`${API_URL}/animals/${id}`);
    return response;
  }

  static async adoptAnimal(id: string) {
    const response = await $api.post(`${API_URL}/animals/${id}/adopt`);
    return response;
  }

  static async getUserAdoptions(userId: string) {
    const response = await $api.get(`${API_URL}/user/adoptions/${userId}`);
    console.log(response.data);
    return response;
  }

  static async getUserAdoptionStats(userId: string) {
    const response = await $api.get(`${API_URL}/user/adoptions/stats/${userId}`);
    return response.data;
  }
  static async moderateAdoption(id: string, approved: boolean) { 
    const response = await $api.post<AnimalResponse>(`${API_URL}/animals/${id}/moderate`, { approved });
    return response;
  }

  static async getUniqueSpecies() {
    const response = await $api.get(`${API_URL}/animals/speciesFilter`);
    return response;
  }
}
