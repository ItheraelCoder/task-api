import { z } from "zod";

export const CreateTaskDTO = z.object({
  body: z.object({
    title: z
      .string({ error: "El titulo es requerido" })
      .min(1, { error: "El titulo no puede estar vacio" })
      .max(255, { error: "El titulo no puede tener mas de 255 caracteres" })
      .trim(),
    description: z.string().trim().default(""),
  }),
});

export const UpdateTaskDTO = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, { error: "El titulo no puede estar vacio" })
      .max(255, { error: "El titulo no puede tener mas de 255 caracteres" })
      .trim()
      .optional(),
    description: z.string().trim().optional(),
    completed: z.boolean().optional(),
  }),
  params: z.object({
    id: z.uuid({ error: "ID invalido" }),
  }),
});

export const TaskParamsDTO = z.object({
  params: z.object({
    id: z.uuid({ error: "ID invalido" }),
  }),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDTO>["body"];
export type UpdateTaskInput = z.infer<typeof UpdateTaskDTO>["body"];
export type TaskParams = z.infer<typeof TaskParamsDTO>["params"];
