import type { Auditable } from './auditable';
import type {SavingEntry} from "./savingEntries.ts";

export interface MinimalSavingProject {
  _id: string;
  amount: number;
  name: string;
  goal?: number;
}

export interface SavingProject extends MinimalSavingProject {
  status: 'active' | 'completed' | 'paused';
  auditable: Auditable;
}

export interface SavingProjectWithEntries extends MinimalSavingProject {
  savingEntries: SavingEntry[];
}