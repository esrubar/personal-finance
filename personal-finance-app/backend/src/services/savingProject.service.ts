import savingsProjectModel from "../models/savingsProject.model"

export const createSavingProject = async (data: any) => await savingsProjectModel.create(data);
export const getSavingProjects = async () => await savingsProjectModel.find();
export const getSavingProjectById = async (id: string) => await savingsProjectModel.findById(id);
export const updateSavingProject = async (id: string, data: any) => await savingsProjectModel.findByIdAndUpdate(id, data, { new: true });
export const deleteSavingProject = async (id: string) => await savingsProjectModel.findByIdAndDelete(id);
