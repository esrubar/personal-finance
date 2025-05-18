import SavingProject from '../models/savingProject.model';

export const createSavingProject = async (data: any) => await SavingProject.create(data);
export const getSavingProjects = async () => await SavingProject.find();
export const getSavingProjectById = async (id: string) => await SavingProject.findById(id);
export const updateSavingProject = async (id: string, data: any) => await SavingProject.findByIdAndUpdate(id, data, { new: true });
export const deleteSavingProject = async (id: string) => await SavingProject.findByIdAndDelete(id);
