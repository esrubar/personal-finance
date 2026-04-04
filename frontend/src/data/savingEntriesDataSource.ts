import axios from "../api/axios.ts";
import type {SavingEntry} from "../models/savingEntries.ts";

const API_URL = '/api/saving-entries';

export const createSavingEntry = async (savingEntry: SavingEntry): Promise<SavingEntry> => {
    const { data } = await axios.post<SavingEntry>(API_URL, savingEntry);
    return data;
};
