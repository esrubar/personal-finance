import { z } from "zod";

export const SavingProjectCreateDto = z.object({
  amount: z.number(),
  goal: z.number().optional()
});

export const SavingProjectUpdateDto = z.object({
  amount: z.number().optional(),
  goal: z.number().optional()
});
