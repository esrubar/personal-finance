import React, {useEffect, useState} from 'react';
import {useMensualExpenses} from "../hooks/useExpenses.ts";
import {useCategoryBudgetsByMonthAndYear} from "../hooks/useCategoryBudgets.ts";
import {getColorForCategory} from "../utils/getCategoryColors.ts";
import {CategoryBudgetCard} from "../components/CategoryBudgetCard.tsx";

export interface CategoryData {
  categoryName: string;
  categoryColor: string;
  budgetAmount: number;
  spentAmount: number;
}

export const Overview: React.FC = () => {
  const [refreshKey] = useState(0);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are 0-indexed in JavaScript, so we add 1 to match the expected format
  const [comparisonMensualExpenses, setcomparisonMensualExpenses] = useState<CategoryData[]>([]);

  const { expenses } = useMensualExpenses(refreshKey);
  const { categoryBudgets } = useCategoryBudgetsByMonthAndYear(month, year);

  useEffect(() => {
  let list: CategoryData[] = [];
  if (!expenses || !categoryBudgets) return;
  expenses.forEach(e => {
    let cb = categoryBudgets.find(c => c.categoryId === e.categoryId);
    list.push({
      categoryName: e.categoryName,
      budgetAmount: cb?.budgetAmount ?? 0,
      spentAmount: e.totalAmount,
      categoryColor: getColorForCategory(e.categoryName)
    });
  });
  setcomparisonMensualExpenses(list);
}, [expenses, categoryBudgets]);

  return (<>
        <h1>Dashboard</h1>
        <div style={{padding: 24}}>
          <CategoryBudgetCard data={comparisonMensualExpenses}/>
        </div>
      </>);
};
