import savingsProjectModel from '../models/savingsProjectModel';
import { createAuditable, updateAuditable } from "./auditableService"

export const createSavingProject = async (data: any, userName: string) => {
    const savingProjectData = {
        ...data,
        auditable: createAuditable(userName),
    }
    return await savingsProjectModel.create(savingProjectData);
}

export const getSavingProjects = async (userName: string) => {
    await savingsProjectModel.find({
        "auditable.createdBy": userName
    });
}
export const getSavingProjectById = async (id: string, userName: string) => {
    const savingProject = await savingsProjectModel.findById(id);
    if (!savingProject) {
        throw Error(`Income with id ${id} not found`);
    }
    if (savingProject.auditable.createdBy != userName) {
        throw new Error("You dont have permission to use this income");
    }
    return savingProject;
}

export const updateSavingProject = async (id: string, data: any, userName: string) => {
    const savingProjectData = {
        ...data,
        auditable: updateAuditable(data.auditable, userName),
    }
    return savingsProjectModel.findByIdAndUpdate(id, savingProjectData, {new: true});
}

export const deleteSavingProject = async (id: string, userName: string) => {
    const savingProject = await savingsProjectModel.findByIdAndDelete(id);
    if (!savingProject) {
        throw Error(`Saving project with id ${id} not found`);
    }
    if (savingProject.auditable.createdBy != userName) {
        throw new Error("You dont have permission to delete this saving project");
    }
}
