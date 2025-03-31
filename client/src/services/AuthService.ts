import { UpdateUserResponse } from './../models/response/UpdateUserResponse';
import { $api, API_URL } from '../http';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
  static async login(username: string, password: string) {
    const response = await $api.post<AuthResponse>(`${API_URL}/login`, {
      username,
      password,
    }, {
      withCredentials: true
    });
    return response;
  }

  static async registration(username: string, email: string, password: string) {
    console.log(username, email, password);
    const response = await $api.post<AuthResponse>(`${API_URL}/registration`, {
      username,
      email,
      password,
    }, {
      withCredentials: true
    });
    return response;
  }

  static async logout() {
    const response = await $api.get(`${API_URL}/logout`, {
      withCredentials: true
    });
    return response;
  }

  static async updateProfile(userId: string, fieldsToUpdate: object) {
    const response = await $api.put<UpdateUserResponse>(
      `${API_URL}/updateProfile/${userId}`,
      { fieldsToUpdate },
      {
        withCredentials: true
      }
    );
    return response;
  }
  static async getAllUsers() {
    const response = await $api.get(
      `${API_URL}/users/all`,
      {
        withCredentials: true
      }
    );
    return response;
  }
  static async banUser(userId: string, isBanned: boolean) {
    const response = await $api.put<UpdateUserResponse>(
      `${API_URL}/users/${userId}/ban`,
      {
        isBanned
      },
      {
        withCredentials: true
      } 
    );
    return response;
  }

  static async deleteUser(userId: string) {
    const response = await $api.delete<UpdateUserResponse>(
      `${API_URL}/users/${userId}`,
      {
        withCredentials: true
      }
    );
    return response;
  }
  static async getUsers() {
    const response = await $api.get(
      `${API_URL}/users`,
      {
        withCredentials: true
      }
    );
    return response;
  }
}