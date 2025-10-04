export interface BankTransaction {
  date: Date;
  description: string;
  amount: number;
  currency: string | null;
  type: 'income' | 'expense';
  raw: string[];
  categoryId: string;
}
