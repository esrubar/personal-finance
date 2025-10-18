export interface BankTransaction {
    tempId: string;
    date: string | null;
    description: string;
    amount: number | null;
    currency: string | null;
    type: 'income' | 'expense' | null;
    raw: string[];
}