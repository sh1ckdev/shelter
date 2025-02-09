import { makeAutoObservable, runInAction, observable } from 'mobx';
import AuthService from '../services/AuthService';
import AnimalService from '../services/AnimalService';
import FeedbackService from '../services/FeedbackService';
import NewsService from '../services/NewsService';
import VolunteerService from '../services/VolunteerService';
import axios from 'axios';
import { API_URL } from '../http';
import { IUser } from '../models/IUser';
import { AuthResponse } from '../models/response/AuthResponse';

class Store {
  isAuth = false;
  isAdmin = false;
  isModerator = false;
  user = {} as IUser;
  isLoadingAuth = false;
  isLoading = false;
  message = '';
  adoptions: IAdoption[] = [];


  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  setAdmin(bool: boolean) {
    this.isAdmin = bool;
  }
  setModerator(bool: boolean) {
    this.isModerator = bool;
  }
  setUser(user: IUser) {
    this.user = user;
  }
  setMessage(message: string) {
    this.message = message;
  }
  setLoading(bool: boolean) {
    this.isLoading = bool;
  }
  setLoadingAuth(bool: boolean) {
    this.isLoadingAuth = bool;
  }
  setAdoptions(adoptions: IAdoption[]) {
    this.adoptions = adoptions;
  }


  handleServerResponse(response: any) {
    if (response.data && response.data.message) {
      this.setMessage(response.data.message);
    }
  }


  async login(username: string, password: string) {
    try {
      this.setLoadingAuth(true);
      const response = await AuthService.login(username, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      this.setAdmin(response.data.user.role === 'admin');
      this.setModerator(response.data.user.role === 'moderator');
      console.log(this.isModerator)
      this.setMessage("Вы успешно вошли");
    } catch (e) {
      console.error('Ошибка входа:', e);
      this.setMessage('Ошибка входа. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoadingAuth(false);
      });
    }
  }

  async registration(username: string, email: string, password: string) {
    try {
      this.setLoadingAuth(true);
      const response = await AuthService.registration(username, email, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      this.setMessage("Успешная регистрация");
    } catch (e) {
      console.error('Ошибка регистрации:', e);
      this.setMessage('Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoadingAuth(false);
      });
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setModerator(false);
      this.setUser({} as IUser);
      this.setMessage("Выход из аккаунта");
    } catch (e) {
      console.error('Ошибка выхода:', e);
      this.setMessage('Ошибка выхода. Попробуйте еще раз.');
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      this.setAuth(true);
      localStorage.setItem('token', response.data.accessToken);
      this.setUser(response.data.user);
      this.setAdmin(response.data.user.role === 'admin');
      this.setModerator(response.data.user.role === 'moderator');

    } catch (e) {
      console.error('Ошибка проверки аутентификации:', e);
      this.setAuth(false);
      this.setUser({} as IUser);
      this.setAdmin(false);
      this.setModerator(false);
    }
  }


  async updateProfile(userId: string, fieldsToUpdate: object) {
    try {
      const response = await AuthService.updateProfile(userId, fieldsToUpdate);
      runInAction(() => {
        this.setUser(response.data.user);
        this.setMessage("Данные обновлены");
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      this.setMessage('Ошибка обновления профиля. Попробуйте еще раз.');
      throw new Error('Не удалось обновить профиль');
    }
  }

  async loadUserAdoptionData(userId) {
    try {
        const data = await AnimalService.getUserAdoptionStats(userId);
        this.user.adoptionsCount = data.adoptionsCount;
        this.user.lastAdoptionDate = data.lastAdoptionDate;
    } catch (error) {
        console.error("Failed to load user adoption data", error);
    }
}

  // Методы для работы с животными
  async fetchAnimals() {
    try {
      const response = await AnimalService.getAnimals();
      return response.data.animals;
    } catch (e) {
      console.error('Ошибка получения списка животных:', e);
      this.setMessage('Ошибка получения списка животных. Попробуйте еще раз.');
    } finally {
    }
  }

  async fetchAnimalsByFilters(filters: object) {
    try {
      this.setLoading(true); 
      const response = await AnimalService.getAnimalsByFilters(filters); 
      console.log(response);

      return response.data;
    } catch (e) {
      console.error('Ошибка получения отфильтрованных животных:', e);
      this.setMessage('Ошибка получения отфильтрованных животных. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false); 
      });
    }
  }

  async fetchAnimalById(id: string) {
    try {
      this.setLoading(true);
      const response = await AnimalService.getAnimalById(id);
      return response.data;
    } catch (e) {
      console.error('Ошибка получения информации о животном:', e);
      this.setMessage('Ошибка получения информации о животном. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async createAnimal(animalData: object) {
    try {
      this.setLoading(true);
      const response = await AnimalService.createAnimal(animalData);
      runInAction(() => {
        this.setMessage("Животное успешно создано");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка создания животного:', e);
      this.setMessage('Ошибка создания животного. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async updateAnimal(id: string, animalData: object) {
    try {
      this.setLoading(true);
      const response = await AnimalService.updateAnimal(id, animalData);
      runInAction(() => {
        this.setMessage("Животное успешно обновлено");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка обновления животного:', e);
      this.setMessage('Ошибка обновления животного. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async deleteAnimal(id: string) {
    try {
      this.setLoading(true);
      const response = await AnimalService.deleteAnimal(id);
      runInAction(() => {
        this.setMessage("Животное успешно удалено");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка удаления животного:', e);
      this.setMessage('Ошибка удаления животного. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  // Методы для работы с отзывами
  async createFeedback(feedbackData: object) {
    try {
      this.setLoading(true);
      const response = await FeedbackService.createFeedback(feedbackData);
      runInAction(() => {
        this.setMessage("Отзыв успешно отправлен");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка отправки отзыва:', e);
      this.setMessage('Ошибка отправки отзыва. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async fetchFeedbacks() {
    try {
      this.setLoading(true);
      const response = await FeedbackService.getFeedback();
      runInAction(() => {
        this.setMessage("Отзывы успешно загружены");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка загрузки отзывов:', e);
      this.setMessage('Ошибка загрузки отзывов. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  // Методы для работы с новостями
  async fetchNews() {
    try {
      this.setLoading(true);
      const response = await NewsService.getNews();
      runInAction(() => {
        this.setMessage("Новости успешно загружены");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка загрузки новостей:', e);
      this.setMessage('Ошибка загрузки новостей. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async createNews(newsData: object) {
    try {
      this.setLoading(true);
      const response = await NewsService.createNews(newsData);
      runInAction(() => {
        this.setMessage("Новость успешно создана");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка создания новости:', e);
      this.setMessage('Ошибка создания новости. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async updateNews(id: string, newsData: object) {
    try {
      this.setLoading(true);
      const response = await NewsService.updateNews(id, newsData);
      runInAction(() => {
        this.setMessage("Новость успешно обновлена");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка обновления новости:', e);
      this.setMessage('Ошибка обновления новости. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async deleteNews(id: string) {
    try {
      this.setLoading(true);
      const response = await NewsService.deleteNews(id);
      runInAction(() => {
        this.setMessage("Новость успешно удалена");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка удаления новости:', e);
      this.setMessage('Ошибка удаления новости. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  // Методы для работы с волонтерами
  async registerVolunteer(volunteerData: object) {
    try {
      this.setLoading(true);
      const response = await VolunteerService.registerVolunteer(volunteerData);
      runInAction(() => {
        this.setMessage("Волонтер успешно зарегистрирован");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка регистрации волонтера:', e);
      this.setMessage('Ошибка регистрации волонтера. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async updateVolunteerStatus(id: string, status: string) {
    try {
      this.setLoading(true);
      const response = await VolunteerService.updateVolunteerStatus(id, status);
      runInAction(() => {
        this.setMessage("Статус волонтера успешно обновлен");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка обновления статуса волонтера:', e);
      this.setMessage('Ошибка обновления статуса волонтера. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async deleteVolunteer(id: string) {
    try {
      this.setLoading(true);
      const response = await VolunteerService.deleteVolunteer(id);
      runInAction(() => {
        this.setMessage("Волонтер успешно удален");
        return response.data;
      });
    } catch (e) {
      console.error('Ошибка удаления волонтера:', e);
      this.setMessage('Ошибка удаления волонтера. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async fetchUserAdoptions(userId: string) {
    try {
      const response = await AnimalService.getUserAdoptions(userId);
      console.log(response.data);
      runInAction(() => {
        this.setAdoptions(response.data);
      });
    } catch (e) {
      console.error('Ошибка получения усыновлений:', e);
      this.setMessage('Ошибка получения усыновлений. Попробуйте еще раз.');
    } finally {
    }
  }

  async adoptAnimal(id: string) {
    try {
      this.setLoading(true);
      const response = await AnimalService.adoptAnimal(id);
      runInAction(() => {
        this.setMessage("Животное успешно усыновлено");
      });
      return response.data;
    } catch (e) {
      console.error('Ошибка усыновления животного:', e);
      this.setMessage('Ошибка усыновления животного. Попробуйте еще раз.');
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }
}

export const store = new Store();