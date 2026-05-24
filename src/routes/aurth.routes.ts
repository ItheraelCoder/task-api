import { AuthController } from "@/controllers/auth.controller";
import { LoginDTO, RegisterDTO } from "@/dto/auth.dto";
import { validate } from "@/middlewares/validate.middleware";
import { AuthService } from "@/services/auth.service";
import { Router } from "express";

const router = Router();

router.post("/register", validate(RegisterDTO), AuthController.register);
router.post("/login", validate(LoginDTO), AuthController.login);

export default router;
