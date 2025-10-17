import axios from '../api/axios';
import type { BankTransaction } from '../models/bankTransaction';

const API_URL = '/api/import-transactions';
export const importTransactions = async (formData: FormData): Promise<BankTransaction[]> => {
  const { data } = await axios.post<BankTransaction[]>(API_URL, formData);
  return data;
};
