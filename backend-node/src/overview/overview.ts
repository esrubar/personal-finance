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

export interface OverviewData {
  stats: Stats;
  evolution: Evolution[];
  monthlyComparison: MonthlyComparisonResponse;
}

export interface MensualExpenseCompare {
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
}

export interface MonthlyComparisonResponse {
  comparison: MensualExpenseCompare[];
  spentByNames: { categoryName: string; spentAmount: number }[];
}

export interface OverviewParams {
  month: number;
  year: number;
  userName: string;
}

export interface AggregatedData {
  categoryId: string;
  categoryName?: string;
  amount: number;
}
