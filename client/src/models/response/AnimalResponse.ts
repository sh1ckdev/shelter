export interface Animal {
  _id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  gender: 'Мужской' | 'Женский' | 'Неизвестно';
  description: string | null;
  imageUrl: string | null;
  status: 'Доступен' | 'Усыновлен' | 'Ожидание';
  addedBy: Object;
  adoptedBy: Object | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalResponse {
  animals: Animal[]; 
  message: string;  
}