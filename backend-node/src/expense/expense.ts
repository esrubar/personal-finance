import { HydratedDocument, Types } from 'mongoose';
import { MinimalIncome } from '../income/income';

export interface Expense {
  amount: number;
  realAmount: number;
  category: Types.ObjectId | string;
  transactionDate?: Date;
  description?: string;
  tempId?: string;
  auditable: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

export interface ExpenseWithIncomes extends Expense {
  incomes?: MinimalIncome[] | null;
}

export type ExpenseDocument = HydratedDocument<Expense>;
