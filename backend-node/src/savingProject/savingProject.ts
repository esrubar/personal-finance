import { Types } from 'mongoose';
import { SavingEntry } from '../savingEntry/savingEntry';

export interface SavingProject {
  amount: number;
  goal?: number;
  name: string;
  status: 'active' | 'completed' | 'paused';
  auditable: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
export interface MinimalSavingProject {
  id: Types.ObjectId | string;
  amount: number;
  goal?: number;
  name: string;
}

export interface SavingProjectWithEntries extends MinimalSavingProject {
  savingEntries: SavingEntry[];
}
