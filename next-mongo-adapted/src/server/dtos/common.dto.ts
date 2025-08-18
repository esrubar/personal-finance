import { z } from "zod";

export const AuditableDto = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string(),
  updatedBy: z.string()
});
