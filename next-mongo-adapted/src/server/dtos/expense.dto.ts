import { z } from "zod";

export const ExpenseCreateDto = z.object({
  amount: z.number(),
  category: z.string().min(1),
  transactionDate: z.coerce.date().optional(),
  description: z.string().optional()
});

export const ExpenseUpdateDto = z.object({
  amount: z.number().optional(),
  category: z.string().min(1).optional(),
  transactionDate: z.coerce.date().optional(),
  description: z.string().optional()
});
