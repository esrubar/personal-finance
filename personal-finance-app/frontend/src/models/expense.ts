import type { Auditable } from "./auditable";
import type { Category } from "./category";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  auditable: Auditable;
}