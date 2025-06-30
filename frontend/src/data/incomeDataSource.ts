import axios from '../api/axios';
import type { Income } from '../models/income';

const API_URL = '/api/incomes';

export const getIncomes = async (): Promise<Income[]> => {
  const { data } = await axios.get<Income[]>(API_URL);
  return data;
};

export const getIncome = async (id: string): Promise<Income> => {
  const { data } = await axios.get<Income>(`${API_URL}/${id}`);
  return data;
};

export const createIncome = async (income: Income): Promise<Income> => {
  const { data } = await axios.post<Income>(API_URL, income);
  return data;
};

export const updateIncome = async (id: string, income: Income): Promise<Income> => {
  const { data } = await axios.put<Income>(`${API_URL}/${id}`, income);
  return data;
};

export const deleteIncome = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
