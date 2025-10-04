import { useState } from 'react';
import * as incomeDataSource from '../data/incomeDataSource';
import type { Income } from '../models/income';

export function useCreateIncome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createIncome = async (income: Income) => {
    setLoading(true);
    setError(null);
    try {
      const result = await incomeDataSource.createIncome(income);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createIncome, loading, error };
}

export function useCreateIncomes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createIncomes = async (incomes: Income[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await incomeDataSource.createIncomes(incomes);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createIncomes, loading, error };
}

export function useUpdateIncome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateIncome = async (id: string, income: Income) => {
    setLoading(true);
    setError(null);
    try {
      const result = await incomeDataSource.updateIncome(id, income);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateIncome, loading, error };
}

export function useDeleteIncome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteIncome = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await incomeDataSource.deleteIncome(id);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteIncome, loading, error };
}
