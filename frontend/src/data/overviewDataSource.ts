import axios from '../api/axios';
import type { OverviewData } from '../models/overview';

const API_URL = '/api/resume';

export const getStats = async (year: number, month: number): Promise<OverviewData> => {
  const { data } = await axios.get<OverviewData>(`${API_URL}/stats/${month}/${year}`);
  return data;
};
