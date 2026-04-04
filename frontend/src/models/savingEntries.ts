import type {MinimalSavingProject} from "./savingProject.ts";

export interface SavingEntry {
    _id?: string;
    projectId: MinimalSavingProject;
    amount: number;
    date: Date;
    note?: string;
}