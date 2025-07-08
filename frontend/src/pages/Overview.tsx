import React, {useEffect, useState} from 'react';
import {useMensualExpenses} from "../hooks/useExpenses.ts";
import {useCategoryBudget} from "../hooks/useCategoryBudgets.ts";
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
  const { expenses } = useMensualExpenses(refreshKey);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const { categoryBudgets } = useCategoryBudget(year, month);
  const [comparisonMensualExpenses, setcomparisonMensualExpenses] = useState<CategoryData[]>([]);

  useEffect(() => {
    let list: CategoryData[] = [];
    expenses.forEach(e =>
    {
      let cb = categoryBudgets.find(c => c.categoryId === e.category._id);
      list.push({
        categoryName: e.category.name,
        budgetAmount: cb?.budgetAmount ?? 0,
        spentAmount: e.amount,
        categoryColor: getColorForCategory(e.category.name)
      })
    })
    setcomparisonMensualExpenses(list);
  }, [])
  return (<>
        <h1>Dashboard</h1>
        <div style={{padding: 24}}>
          <CategoryBudgetCard data={comparisonMensualExpenses}/>
        </div>
      </>);
};
