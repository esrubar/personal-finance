import { useState } from 'react';
import * as categoryBudgetDataSource from '../data/categoryBudgetDataSource.ts';
import type { CategoryBudget } from '../models/categoryBudget.ts';

export function useCreateCategoryBudget() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCategoryBudget = async (categoryBudget: CategoryBudget) => {
    setLoading(true);
    setError(null);
    try {
      return await categoryBudgetDataSource.createCategoryBudget(categoryBudget);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCategoryBudget, loading, error };
}
