import { useState, useEffect } from 'react';
import * as categoryDataSource from '../data/categoryDataSource';
import type { Category } from '../models/category';

export function useCategories(refreshKey?: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    categoryDataSource
      .getCategories()
      .then(setCategories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { categories, loading, error };
}

export function useCategory(id: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    categoryDataSource
      .getCategory(id)
      .then(setCategory)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { category, loading, error };
}
