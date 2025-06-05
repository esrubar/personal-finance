import axios from '../api/axios';
import type { User } from '../models/user';

const API_URL = '/api/users';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(API_URL);
  return data;
};

export const getUser = async (id: string): Promise<User> => {
  const { data } = await axios.get<User>(`${API_URL}/${id}`);
  return data;
};

export const createUser = async (user: User): Promise<User> => {
  const { data } = await axios.post<User>(API_URL, user);
  return data;
};

export const updateUser = async (id: string, user: User): Promise<User> => {
  const { data } = await axios.put<User>(`${API_URL}/${id}`, user);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
