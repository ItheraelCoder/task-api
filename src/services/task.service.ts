import type { CreateTaskInput, UpdateTaskInput } from "@/dto/task.dto";
import { TaskModel } from "@/models/task.model";
import { AppError } from "@/utils/AppError";

export const TaskService = {
  create: async (input: CreateTaskInput, userId: string) => {
    return TaskModel.create({
      title: input.title,
      description: input.description,
      userId: userId,
    });
  },
  getAll: async (userId: string) => {
    return TaskModel.findAllByUser(userId);
  },
  getOne: async (id: string, userId: string, role: string) => {
    const task = await TaskModel.findById(id);

    if (!task) {
      throw new AppError("Task no encontrada", 404);
    }

    if (role !== "admin" && task.userId !== userId) {
      throw new AppError("No tienes permisos para realizar esta accion", 403);
    }

    return task;
  },
  update: async (id: string, userId: string, input: UpdateTaskInput) => {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw new AppError("Task no encontrada", 404);
    }

    if (task.userId !== userId) {
      throw new AppError("No tienes permisos para realizar esta accion", 403);
    }

    return TaskModel.update(id, input);
  },
  delete: async (id: string, userId: string, role: string) => {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw new AppError("Task no encontrada", 404);
    }

    if (role !== "admin" && task.userId !== userId) {
      throw new AppError("No tienes permisos para realizar esta accion", 403);
    }

    await TaskModel.delete(id);
  },
};
