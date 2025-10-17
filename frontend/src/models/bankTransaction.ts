export interface BankTransaction {
  tempId: string;
  date: Date;
  description: string;
  amount: number;
  currency: string | null;
  type: 'income' | 'expense';
  raw: string[];
  categoryId: string;
  linkedExpenseId?: string;
}
