import type { Auditable } from "./auditable";
import type { Category } from "./category";

export interface Expense {
  _id: string;
  amount: number;
  category: Category;
  transactionDate?: Date;
  description?: string;
  auditable: Auditable;
}

export interface MensualExpense {
  categoryId: string;
  totalAmount: number;
  categoryName: string;
}