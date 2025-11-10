// src/models/response/UpdateUserResponse.ts
import { IUser } from '../IUser';

export interface UpdateUserResponse {
  message: string;
  user: IUser;
}