import axios from '../api/axios';
import type { Category } from '../models/category';

const API_URL = '/api/categories';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>(API_URL);
  return data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const { data } = await axios.get<Category>(`${API_URL}/${id}`);
  return data;
};

export const createCategory = async (category: Category): Promise<Category> => {
  const { data } = await axios.post<Category>(API_URL, category);
  return data;
};

export const updateCategory = async (id: string, category: Category): Promise<Category> => {
  const { data } = await axios.put<Category>(`${API_URL}/${id}`, category);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
