import type { Auditable } from "./auditable";
import type { Category } from "./category";

export interface Expense {
  _id: string;
  amount: number;
  category: Category;
  transactionDate?: Date;
  description?: string;
  auditable?: Auditable;
}

export interface MensualExpense {
  categoryId: string;
  totalAmount: number;
  categoryName: string;
}

export const createExpense = (income: Omit<Expense, '_id' | 'auditable' | 'category'>, categoryId: string): Expense => {
  const category =  { _id: categoryId, name: "" };
  return {
    _id: '',
    amount: income.amount,
    category: category,
    transactionDate: income.transactionDate,
    description: income.description
  };
}