import { createAuditable, updateAuditable } from '../auditable/auditableService';
import { SavingProjectModel } from './savingsProjectModel';
import { SavingEntryModel } from '../savingEntry/savingEntryModel';
import { SavingProjectWithEntries } from './savingProject';
import { ExpenseModel } from '../expense/expenseModel';
import { SavingEntryDto } from '../savingEntry/savingEntry';

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
  })
    .sort({ name: 1 })
    .lean();
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

  const savingEntries: SavingEntryDto[] = await SavingEntryModel.find({
    'auditable.createdBy': userName,
    projectId: savingProject._id,
  })
    .sort({ date: -1 })
    .lean();

  const expenses = await ExpenseModel.find({
    projectId: savingProject._id,
    'auditable.createdBy': userName,
  })
    .select('_id projectId realAmount transactionDate description')
    .sort({ transactionDate: -1 })
    .lean();

  const mappingExpenses = expenses.map((expense: any) => ({
    projectId: expense.projectId,
    amount: -expense.realAmount,
    date: expense.transactionDate,
    note: expense.description,
  }));

  savingEntries.push(...mappingExpenses);
  savingEntries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    id: savingProject._id,
    amount: savingProject.amount,
    goal: savingProject.goal,
    name: savingProject.name,
    savingEntries: savingEntries,
  };
};
