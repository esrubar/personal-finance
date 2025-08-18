import { z } from "zod";

export const UserCreateDto = z.object({
  name: z.string().min(1),
  password: z.string().min(6)
});

export const UserUpdateDto = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional()
});

export const LoginDto = z.object({
  name: z.string().min(1),
  password: z.string().min(6)
});
