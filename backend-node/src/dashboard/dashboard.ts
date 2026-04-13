export interface DashboardData {
  stats: {
    income: number;
    expenses: number;
    savings: number;
    budget: number;
  };
  evolution: { month: string; type: string; value: number }[];
  categories: { name: string; value: number }[];
  budgetComparison: { category: string; actual: number; planned: number }[];
}
