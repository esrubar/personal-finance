import axios from '../api/axios';
import type { MinimalUser } from '../models/user';

//const API_URL = '/api/auth/login';
const API_URL = '/login';
export const login = async (values: { name: string; password: string }): Promise<MinimalUser> => {
  const { data } = await axios.post<MinimalUser>(API_URL, values, {
    withCredentials: true,
  });
  return data;
};

export const protectedEndpoint = async () => {
  const { data } = await axios.post('/protected', {
    withCredentials: true,
  });
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get('/api/auth/me', {
    withCredentials: true,
  });
  return data;
};

export const logout = async () => {
  await axios.post('/logout', {});
};
