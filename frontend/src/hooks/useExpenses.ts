import { useState, useEffect } from 'react';
import * as expenseDataSource from '../data/expenseDataSource';
import type { Expense, MensualExpense } from '../models/expense';
import type { FilteredExpenseParams } from '../models/filteredExpenseParams.ts';
import type { PaginatedResponse } from '../models/paginatedResponse.ts';

export function useExpenses(params: FilteredExpenseParams, refreshKey?: number) {
  const [expenses, setExpenses] = useState<PaginatedResponse<Expense>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    expenseDataSource
      .getExpenses(params)
      .then((res) => {
        setExpenses(res);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [params, refreshKey]);

  return { expenses, loading, error };
}

export function useExpense(id: string) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    expenseDataSource
      .getExpense(id)
      .then(setExpense)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { expense, loading, error };
}

export function useMensualExpenses(refreshKey?: number) {
  const [expenses, setExpenses] = useState<MensualExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    expenseDataSource
      .getMensualExpenses()
      .then(setExpenses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { expenses, loading, error };
}
