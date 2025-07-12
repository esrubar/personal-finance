export interface BankTransaction {
  date: string | null;
  description: string;
  amount: number | null;
  currency: string | null;
  type: 'charge' | 'deposit' | null;
  raw: string[];
}