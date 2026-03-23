import { z } from "zod/v4";

export const createUserSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  role: z.string().min(1, "Rôle requis"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères").optional(),
  email: z.email("Email invalide").optional(),
  role: z.string().min(1, "Rôle requis").optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
