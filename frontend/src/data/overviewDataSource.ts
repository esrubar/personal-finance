import axios from '../api/axios';
import type { Stats } from '../models/overview';

const API_URL = '/api/resume';

export const getStats = async (year: number, month: number): Promise<Stats> => {
  const { data } = await axios.get<Stats>(`${API_URL}/stats/${month}/${year}`);
  return data;
};
