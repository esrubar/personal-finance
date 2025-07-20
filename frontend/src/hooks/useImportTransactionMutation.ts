import { useState } from "react";
import * as importTransactionDataSource from '../data/importTransactionDataSource';

export function useImportTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await importTransactionDataSource.importTransactions(formData);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  return { fetchTransactions, loading, error };
}