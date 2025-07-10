import { useState, useEffect } from 'react';
import * as categoryBudgetDataSource from '../data/categoryBudgetDataSource.ts';
import type { CategoryBudget } from '../models/categoryBudget.ts';


export function useCategoryBudgetsByMonthAndYear(month: number, year: number) {
    const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!month || !year) return;
        setLoading(true);
        categoryBudgetDataSource.getCategoryBudgetsByMonthAndYear(month, year)
            .then(setCategoryBudgets)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [month, year]);

    return { categoryBudgets, loading, error };
}

export function useAllCategoryBudgets(refreshKey?: number) {
    const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        categoryBudgetDataSource.getAllCategoryBudgets()
            .then(setCategoryBudgets)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [refreshKey]);

    return { categoryBudgets, loading, error };
}