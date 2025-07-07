import { useState, useEffect } from 'react';
import * as categoryBudgetDataSource from '../data/categoryBudgetDataSource.ts';
import type {CategoryBudget} from "../models/categoryBudget.ts";

export function useCategoryBudget(month: number, year: number) {
    const [cCategoryBudget, setCategoryBudget] = useState<CategoryBudget | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!month || !year) return;
        setLoading(true);
        categoryBudgetDataSource.getCategoryBudget(month, year)
            .then(setCategoryBudget)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [month, year]);

    return { cCategoryBudget, loading, error };
}