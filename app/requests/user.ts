import { IUser } from '@/src/types';
import axios, { isAxiosError } from 'axios';

export const createUserRequest = async (data: IUser) => {
  const response = await axios.post('/api/user', {
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