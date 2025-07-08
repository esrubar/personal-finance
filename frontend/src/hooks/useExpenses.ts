import { useState, useEffect } from 'react';
import * as expenseDataSource from '../data/expenseDataSource';
import type { Expense } from '../models/expense';

export function useExpenses(refreshKey?: number) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    expenseDataSource.getExpenses()
      .then(setExpenses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { expenses, loading, error };
}

export function useExpense(id: string) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    expenseDataSource.getExpense(id)
      .then(setExpense)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { expense, loading, error };
}

export function useMensualExpenses(refreshKey?: number) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    expenseDataSource.getMensualExpenses()
        .then(setExpenses)
        .catch(setError)
        .finally(() => setLoading(false));
  }, [refreshKey]);

  return { expenses, loading, error };
}
