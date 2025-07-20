import axios from "axios";
import type { BankTransaction } from "../models/bankTransaction";

const API_URL = '/api/import-transactions';

export const importTransactions = async (formData: FormData): Promise<BankTransaction[]> => {
  const { data } = await axios.post<BankTransaction[]>("http://localhost:3000/api/import-transactions", formData);
  debugger;
  return data;
};