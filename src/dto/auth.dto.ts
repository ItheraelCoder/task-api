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
      .pipe(
        z
          .string()
          .min(8, { error: "la constraseña debe tener al menos 8 caracteres" })
          .max(72, {
            error: "la contraseña no puede tener mas de 72 caracteres",
          }),
      ),
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
      .pipe(
        z
          .string()
          .min(8, { error: "la contraseña debe tener al menos 8 caracteres" })
          .max(72, {
            error: "la contraseña no puede tener mas de 72 caracteres",
          }),
      ),
  }),
});

export type RegisterInput = z.infer<typeof RegisterDTO>["body"];
export type LoginInput = z.infer<typeof LoginDTO>["body"];
