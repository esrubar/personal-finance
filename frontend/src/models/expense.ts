import dayjs from 'dayjs';
import type { Auditable } from './auditable';
import type { BankTransaction } from './bankTransaction';
import type { MinimalCategory } from './category';
import type { MinimalIncome } from './income.ts';
import type { MinimalSavingProject } from './savingProject.ts';

export interface Expense {
  _id?: string;
  amount: number;
  realAmount?: number;
  category: MinimalCategory;
  savingProject?: MinimalSavingProject;
  transactionDate?: Date;
  description?: string;
  auditable?: Auditable;
  tempId?: string;
  incomes?: MinimalIncome[];
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

export interface SavingProjectExpense {
  id: string;
  projectId: string;
  realAmount: number;
  transactionDate: Date;
  description?: string;
}

export const createExpenseFromTransaction = (
  transaction: Omit<BankTransaction, '_id' | 'auditable' | 'category'>,
  categoryId: string,
  projectId?: string
): Expense => {
  const category = { _id: categoryId, name: '' };
  const savingProject = projectId ? { _id: projectId, name: '', amount: 0 } : undefined;
  return {
    amount: transaction.amount,
    category: category,
    savingProject: savingProject,
    transactionDate: transaction.date ? dayjs(transaction.date, 'DD/MM/YYYY').toDate() : undefined,
    description: transaction.description,
    tempId: transaction.tempId,
  };
};
