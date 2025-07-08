import { useState, useEffect } from 'react';
import * as categoryBudgetDataSource from '../data/categoryBudgetDataSource.ts';
import type { CategoryBudget } from '../models/categoryBudget.ts';


export function useCategoryBudget(month: number, year: number) {
    const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!month || !year) return;
        setLoading(true);
        categoryBudgetDataSource.getCategoryBudgets(month, year)
            .then(setCategoryBudgets)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [month, year]);

    return { categoryBudgets, loading, error };
}