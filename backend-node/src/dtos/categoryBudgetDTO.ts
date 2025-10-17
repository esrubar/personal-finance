
export interface CategoryBudgetDTO {
  id: string;
  categoryId: string;
  month: number;
  year: number;
  budgetAmount: number;
  categoryName?: string;
}