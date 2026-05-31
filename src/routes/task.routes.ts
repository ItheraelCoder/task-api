import { TaskController } from "@/controllers/task.controller";
import { CreateTaskDTO, TaskParamsDTO, UpdateTaskDTO } from "@/dto/task.dto";
import { authenticate } from "@/middlewares/auth.middlware";
import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.post("/", validate(CreateTaskDTO), TaskController.create);
router.get("/", TaskController.getAll);
router.get("/:id", validate(TaskParamsDTO), TaskController.getOne);
router.patch("/:id", validate(UpdateTaskDTO), TaskController.update);
router.delete("/:id", validate(TaskParamsDTO), TaskController.delete);

export default router;
