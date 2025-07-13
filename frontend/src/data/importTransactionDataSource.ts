import axios from "axios";
import type { BankTransaction } from "../models/bankTransaction";

const API_URL = '/api/import';

export const importTransactions = async (formData: FormData): Promise<BankTransaction[]> => {
  const { data } = await axios.post<BankTransaction[]>(API_URL, formData);
  return data;
};