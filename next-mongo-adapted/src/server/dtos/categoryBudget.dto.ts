import { z } from "zod";

export const CategoryBudgetCreateDto = z.object({
  categoryId: z.string().min(1),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(3000),
  budgetAmount: z.number().nonnegative()
});

export const CategoryBudgetUpdateDto = z.object({
  categoryId: z.string().min(1).optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(3000).optional(),
  budgetAmount: z.number().nonnegative().optional()
});
