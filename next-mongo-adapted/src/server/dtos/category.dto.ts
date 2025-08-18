import { z } from "zod";

export const CategoryCreateDto = z.object({
  name: z.string().min(1)
});
export const CategoryUpdateDto = z.object({
  name: z.string().min(1).optional()
});
