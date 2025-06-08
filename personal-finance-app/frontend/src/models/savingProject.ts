import type { Auditable } from "./auditable";

export interface SavingProject {
  _id: string;
  amount: number;
  auditable: Auditable;
}