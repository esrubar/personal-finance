import {createAuditable} from "../auditable/auditableService";
import {SavingEntryModel} from "./savingEntryModel";

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