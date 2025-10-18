import savingsProjectModel from '../models/savingsProjectModel';
import {createAuditable, updateAuditable} from "./auditableService"

export const createSavingProject = async (data: any) => {
    const savingProjectData = {
        ...data,
        auditable: createAuditable(),
    }
    return await savingsProjectModel.create(savingProjectData);
}

export const getSavingProjects = async () => await savingsProjectModel.find();
export const getSavingProjectById = async (id: string) => await savingsProjectModel.findById(id);

export const updateSavingProject = async (id: string, data: any) => {
    const savingProjectData = {
        ...data,
        auditable: updateAuditable(data.auditable),
    }
    return await savingsProjectModel.findByIdAndUpdate(id, savingProjectData, {new: true});
}

export const deleteSavingProject = async (id: string) => await savingsProjectModel.findByIdAndDelete(id);
