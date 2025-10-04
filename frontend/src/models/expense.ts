import dayjs from 'dayjs';
import type { Auditable } from './auditable';
import type { BankTransaction } from './bankTransaction';
import type { Category } from './category';

export interface Expense {
  _id?: string;
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

export interface ExpensesSummary {
  expenses: Expense[];
  totalAmount: number;
}

export const createExpenseFromTransaction = (
  transaction: Omit<BankTransaction, '_id' | 'auditable' | 'category'>,
  categoryId: string
): Expense => {
  const category = { _id: categoryId, name: '' };
  return {
    amount: transaction.amount,
    category: category,
    transactionDate: transaction.date ? dayjs(transaction.date, 'DD/MM/YYYY').toDate() : undefined,
    description: transaction.description,
  };
};
