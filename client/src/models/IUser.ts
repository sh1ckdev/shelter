// src/models/IUser.ts
export interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    adoptionsCount: number;
    lastAdoptionDate: string;
  }