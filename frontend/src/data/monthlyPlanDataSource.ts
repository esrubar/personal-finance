import axios from '../api/axios';
import type { LastMonthlyPlanning } from '../models/monthlyPlan';

const API_URL = '/api/monthlyPlan';

export const getPreviousPlanning = async (
  year: number,
  month: number
): Promise<LastMonthlyPlanning[]> => {
  const { data } = await axios.get<LastMonthlyPlanning[]>(`${API_URL}/${month}/${year}`);
  return data;
};
