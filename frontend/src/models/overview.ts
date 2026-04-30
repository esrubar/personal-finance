import type { MensualExpenseCompare } from './mensualExpenseCompare';

export interface Stats {
  income: number;
  expenses: number;
  savings: number;
  budget: number;
}

export interface Evolution {
  month: string;
  type: string;
  value: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface OverviewData {
  stats: Stats;
  evolution: Evolution[];
  monthlyComparison: MonthlyComparisonResponse;
}

export interface MonthlyComparisonResponse {
  comparison: MensualExpenseCompare[];
  spentByNames: { categoryName: string; spentAmount: number }[];
}
