import { useState } from 'react';
import * as expenseDataSource from '../data/expenseDataSource';
import type { Expense } from '../models/expense';

export function useCreateExpense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createExpense = async (expense: Expense) => {
    setLoading(true);
    setError(null);
    try {
      const result = await expenseDataSource.createExpense(expense);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createExpense, loading, error };
}

export function useUpdateExpense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateExpense = async (id: string, expense: Expense) => {
    setLoading(true);
    setError(null);
    try {
      const result = await expenseDataSource.updateExpense(id, expense);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateExpense, loading, error };
}

export function useDeleteExpense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteExpense = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await expenseDataSource.deleteExpense(id);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteExpense, loading, error };
}
