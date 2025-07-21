import type { Auditable } from './auditable';
import type { Category } from './category';

export interface Income {
  _id: string;
  amount: number;
  category: Category;
  transactionDate?: Date;
  description?: string;
  auditable?: Auditable;
}

export const createIncome = (income: Omit<Income, '_id' | 'auditable' | 'category'>, categoryId: string): Income => {
  const category =  { _id: categoryId, name: "" };
  return {
    _id: '',
    amount: income.amount,
    category: category,
    transactionDate: income.transactionDate,
    description: income.description
  };
}