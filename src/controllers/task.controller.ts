import type {
  CreateTaskInput,
  TaskParams,
  UpdateTaskInput,
} from "@/dto/task.dto";
import { TaskService } from "@/services/task.service";
import { catchAsync } from "@/utils/catchAsync";
import type { Request, Response } from "express";

export const TaskController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const input = req.body as CreateTaskInput;
    const task = await TaskService.create(input, req.user!.id);
    res.status(201).json({ status: "success", data: { task } });
  }),
  getAll: catchAsync(async (req: Request, res: Response) => {
    const tasks = await TaskService.getAll(req.user!.id);
    res.status(200).json({ status: "success", data: { tasks } });
  }),
  getOne: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as TaskParams;
    const task = await TaskService.getOne(id, req.user!.id, req.user!.role);
    res.status(200).json({ status: "success", data: { task } });
  }),
  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as TaskParams;
    const input = req.body as UpdateTaskInput;
    const task = await TaskService.update(id, req.user!.id, input);
    res.status(201).json({ status: "success", data: { task } });
  }),
  delete: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as TaskParams;
    await TaskService.delete(id, req.user!.id, req.user!.role);
    res.status(204).send();
  }),
};
