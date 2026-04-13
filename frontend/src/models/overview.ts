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
}