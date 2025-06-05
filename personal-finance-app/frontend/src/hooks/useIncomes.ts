import { useState, useEffect } from 'react';
import * as incomeDataSource from '../data/incomeDataSource';
import type { Income } from '../models/income';

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    incomeDataSource.getIncomes()
      .then(setIncomes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { incomes, loading, error };
}

export function useIncome(id: string) {
  const [income, setIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    incomeDataSource.getIncome(id)
      .then(setIncome)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { income, loading, error };
}
