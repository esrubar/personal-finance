import mongoose, { Types } from 'mongoose';
import { MinimalSavingProject } from '../savingProject/savingProject';

export interface SavingEntry {
  projectId: mongoose.Types.ObjectId;
  amount: number;
  note?: string;
  date: Date;
  auditable: {
    createdBy: string;
  };
}

export interface SavingEntryWithMinimalProject {
  id: Types.ObjectId | string;
  amount: number;
  date: Date;
  note?: string;
  savingProject: MinimalSavingProject;
}
