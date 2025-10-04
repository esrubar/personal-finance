import dayjs from 'dayjs';
import type { Auditable } from './auditable';
import type { BankTransaction } from './bankTransaction';
import type { Category } from './category';

export interface Income {
  _id?: string;
  amount: number;
  category: Category;
  transactionDate?: Date;
  description?: string;
  auditable?: Auditable;
}

export const createIncome = (
  transaction: Omit<BankTransaction, '_id' | 'auditable' | 'category'>,
  categoryId: string
): Income => {
  const category = { _id: categoryId, name: '' };
  return {
    amount: transaction.amount,
    category: category,
    transactionDate: transaction.date ? dayjs(transaction.date, 'DD/MM/YYYY').toDate() : undefined,
    description: transaction.description,
  };
};
