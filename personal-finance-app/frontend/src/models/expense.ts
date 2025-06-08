import type { Auditable } from "./auditable";
import type { Category } from "./category";

export interface Expense {
  _id: string;
  amount: number;
  category: Category;
  auditable: Auditable;
}