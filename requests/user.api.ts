import { IUser } from '@/src/types';
import axios, { isAxiosError } from 'axios';

export const createUserRequest = async (data: IUser) => {
  const response = await axios.post('/api/user', {
    ...data,
  });
  return response.data;
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  const response = await axios.put(`/api/user/${id}`, {
    ...data,
  });
  return response.data;
};

export const getUsersRequest = async () => {
  const response = await axios.get('/api/user');
  return response.data;
};

export const getUserMy = async () => {
  const response = await axios.get('/api/user/my');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`/api/user/${id}`);
  return response.data;
};
