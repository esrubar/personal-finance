import axios from '../api/axios';
const API_URL = '/api/auth';

export const login = async (name: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { name, password });
  return response.data;
};

export const register = async (name: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, password });
  return response.data;
};