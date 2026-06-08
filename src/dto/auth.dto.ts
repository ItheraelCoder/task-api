import { z } from "zod";

export const RegisterDTO = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { error: "el email es requerido" })
      .pipe(z.email({ error: "el email es invalido" })),
    password: z
      .string()
      .min(1, { error: "la contraseña es requerida" })
      .min(8, { error: "la contraseña debe tener al menos 8 caracteres" })
      .max(72, { error: "la contraseña no puede tener más de 72 caracteres" }),
  }),
});

export const LoginDTO = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { error: "el email es requerido" })
      .pipe(z.email({ error: "el email es invalido" })),
    password: z
      .string()
      .min(1, { error: "la contraseña es requerida" })
      .min(8, { error: "la contraseña debe tener al menos 8 caracteres" })
      .max(72, { error: "la contraseña no puede tener más de 72 caracteres" }),
  }),
});

export const RefreshDTO = z.object({
  body: z.object({
    refreshToken: z.string({ error: "El refresh token es requerido" }),
  }),
});

export const LogoutDTO = z.object({
  body: z.object({
    refreshToken: z.string({ error: "El refresh token es requerido" }),
  }),
});

export type RegisterInput = z.infer<typeof RegisterDTO>["body"];
export type LoginInput = z.infer<typeof LoginDTO>["body"];
export type RefreshInput = z.infer<typeof RefreshDTO>["body"];
export type LogoutInput = z.infer<typeof LogoutDTO>["body"];
