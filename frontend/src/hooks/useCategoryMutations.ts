import { useState } from 'react';
import * as categoryDataSource from '../data/categoryDataSource';
import type { Category } from '../models/category';

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCategory = async (category: Category) => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryDataSource.createCategory(category);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error };
}

export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCategory = async (id: string, category: Category) => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryDataSource.updateCategory(id, category);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
}

export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await categoryDataSource.deleteCategory(id);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading, error };
}
