import { z } from "zod/v4";

export const registerSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  confirmPassword: z.string(),
}).check(
  ctx => ctx.value.password === ctx.value.confirmPassword,
  "Les mots de passe ne correspondent pas"
);

export type RegisterFormData = z.infer<typeof registerSchema>;
