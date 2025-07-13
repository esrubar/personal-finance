import { useEffect, useState } from "react";
import * as importTransactionDataSource from '../data/importTransactionDataSource';
import type { BankTransaction } from "../models/bankTransaction";

export function useImportTransaction(formData: FormData) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);

  useEffect(() => {
    if (!formData) return;
    setLoading(true);
    setError(null);
    try {
      importTransactionDataSource
        .importTransactions(formData)
        .then(setTransactions)
        .catch(setError)
        .finally(() => setLoading(false));

    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return { transactions, loading, error };
}