import { createAuditable, updateAuditable } from '../auditable/auditableService';
import { SavingProjectModel } from './savingsProjectModel';
import { SavingEntryModel } from '../savingEntry/savingEntryModel';
import { SavingProjectWithEntries } from './savingProject';

export const createSavingProject = async (data: any, userName: string) => {
  const savingProjectData = {
    ...data,
    auditable: createAuditable(userName),
  };
  return await SavingProjectModel.create(savingProjectData);
};

export const getSavingProjects = async (userName: string) => {
  return SavingProjectModel.find({
    'auditable.createdBy': userName,
  }).lean();
};

export const getSavingProjectById = async (id: string, userName: string) => {
  const savingProject = await SavingProjectModel.findById(id);
  if (!savingProject) {
    throw Error(`Income with id ${id} not found`);
  }
  if (savingProject.auditable.createdBy != userName) {
    throw new Error('You dont have permission to use this income');
  }
  return savingProject;
};

export const updateSavingProject = async (id: string, data: any, userName: string) => {
  const savingProjectData = {
    ...data,
    auditable: updateAuditable(data.auditable, userName),
  };
  return SavingProjectModel.findByIdAndUpdate(id, savingProjectData, { new: true });
};

export const deleteSavingProject = async (id: string, userName: string) => {
  const savingProject = await SavingProjectModel.findByIdAndDelete(id);
  if (!savingProject) {
    throw Error(`Saving project with id ${id} not found`);
  }
  if (savingProject.auditable.createdBy != userName) {
    throw new Error('You dont have permission to delete this saving project');
  }
};

export const getSavingProjectWithEntries = async (
  id: string,
  userName: string,
): Promise<SavingProjectWithEntries> => {
  const savingProject = await SavingProjectModel.findOne({
    _id: id,
    'auditable.createdBy': userName,
  });
  if (!savingProject) {
    throw Error(`There are no saving project with id ${id}`);
  }
  if (savingProject.auditable.createdBy != userName) {
    throw new Error('You dont have permission to use this income');
  }

  const savingEntries = await SavingEntryModel.find({
    'auditable.createdBy': userName,
    projectId: savingProject._id,
  });

  return {
    id: savingProject._id,
    amount: savingProject.amount,
    goal: savingProject.goal,
    name: savingProject.name,
    savingEntries: savingEntries,
  };
};
