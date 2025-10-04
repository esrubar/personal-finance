import axios from '../api/axios';
import type { SavingProject } from '../models/savingProject';

const API_URL = '/api/saving-projects';

export const getSavingProjects = async (): Promise<SavingProject[]> => {
  const { data } = await axios.get<SavingProject[]>(API_URL);
  return data;
};

export const getSavingProject = async (id: string): Promise<SavingProject> => {
  const { data } = await axios.get<SavingProject>(`${API_URL}/${id}`);
  return data;
};

export const createSavingProject = async (savingProject: SavingProject): Promise<SavingProject> => {
  const { data } = await axios.post<SavingProject>(API_URL, savingProject);
  return data;
};

export const updateSavingProject = async (
  id: string,
  savingProject: SavingProject
): Promise<SavingProject> => {
  const { data } = await axios.put<SavingProject>(`${API_URL}/${id}`, savingProject);
  return data;
};

export const deleteSavingProject = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
