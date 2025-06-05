import axios from '../api/axios';
import type { Expense } from '../models/expense';

const API_URL = '/api/expenses';

export const getExpenses = async (): Promise<Expense[]> => {
  const { data } = await axios.get<Expense[]>(API_URL);
  return data;
};

export const getExpense = async (id: string): Promise<Expense> => {
  const { data } = await axios.get<Expense>(`${API_URL}/${id}`);
  return data;
};

export const createExpense = async (expense: Expense): Promise<Expense> => {
  const { data } = await axios.post<Expense>(API_URL, expense);
  return data;
};

export const updateExpense = async (id: string, expense: Expense): Promise<Expense> => {
  const { data } = await axios.put<Expense>(`${API_URL}/${id}`, expense);
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};