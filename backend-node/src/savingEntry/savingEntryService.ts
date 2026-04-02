import {createAuditable} from "../auditable/auditableService";
import {SavingEntryModel} from "./savingEntryModel";
import {SavingProjectModel} from "../savingProject/savingsProjectModel";

export const createSavingEntry = async (data: any, userName: string) => {
    const savingEntryData = {
        ...data,
        auditable: createAuditable(userName),
    };
    return await SavingEntryModel.create(savingEntryData);
};

export const getSavingEntries = async (userName: string) => {
    await SavingEntryModel.find({
        'auditable.createdBy': userName,
    }).lean();
};
export const getSavingEntriesByProjectId = async (id: string, userName: string) => {
    const savingProject = await SavingProjectModel.findById(id);
    if (!savingProject) {
        throw Error(`There are no saving project with id ${id}`);
    }
    if (savingProject.auditable.createdBy != userName) {
        throw new Error('You dont have permission to use this income');
    }
    return savingProject;
};