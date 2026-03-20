import React, { useState } from 'react';
import { CategoryBudgetCard } from '../components/CategoryBudgetCard.tsx';
import {useComparisonMensualExpenses} from "../hooks/useComparisonMensualExpenses.ts";

export interface CategoryData {
  categoryName: string;
  categoryColor: string;
  budgetAmount: number;
  spentAmount: number;
}

export const OverviewPage: React.FC = () => {
  const [refreshKey] = useState(0);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are 0-indexed in JavaScript, so we add 1 to match the expected format

  const { comparisonMensualExpenses } = useComparisonMensualExpenses(month, year, refreshKey);

  return (
    <>
      <h1>Dashboard</h1>
      <div style={{ padding: 24 }}>
        <CategoryBudgetCard data={comparisonMensualExpenses} />
      </div>
    </>
  );
};
