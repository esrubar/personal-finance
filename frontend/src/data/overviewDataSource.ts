import axios from '../api/axios';

const API_URL = '/api/resume';

export const getStats = async (year: number, month: number): Promise<number> => {
  const { data } = await axios.get<number>(`${API_URL}/stats/${month}/${year}`);
  return data;
};