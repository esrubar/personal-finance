import { useEffect, useState } from 'react';
import { getColorForCategory } from '../utils/getCategoryColors.ts';
import { useMensualExpenses } from './useExpenses.ts';
import { useCategoryBudgetsByMonthAndYear } from './useCategoryBudgets.ts';
import type { MensualExpenseCompare } from '../models/mensualExpenseCompare.ts';

export function useComparisonMensualExpenses(month: number, year: number, refreshKey?: number) {
  const [comparisonMensualExpenses, setComparisonMensualExpenses] = useState<MensualExpenseCompare[]>([]);
  const [loading, setLoading] = useState(true);

  const { expenses } = useMensualExpenses(month, year, refreshKey);
  const { categoryBudgets } = useCategoryBudgetsByMonthAndYear(month, year);

  useEffect(() => {
    setLoading(true);

    const list: MensualExpenseCompare[] = [];
    if (!expenses || !categoryBudgets) return;
    expenses.forEach((e) => {
      const cb = categoryBudgets.find((c) => c.categoryId === e.categoryId);
      list.push({
        categoryName: e.categoryName,
        budgetAmount: cb?.budgetAmount ?? 0,
        spentAmount: e.totalAmount,
        categoryColor: getColorForCategory(e.categoryName),
      });
    });
    setComparisonMensualExpenses(list);

    setLoading(false);
  }, [expenses, categoryBudgets]);

  return { comparisonMensualExpenses, loading };
}
