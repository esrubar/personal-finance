import type { Auditable } from "./auditable";

export interface SavingProject {
  id: string;
  amount: number;
  auditable: Auditable;
}