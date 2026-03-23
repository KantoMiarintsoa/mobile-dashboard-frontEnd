import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
