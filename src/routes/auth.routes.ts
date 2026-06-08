import { AuthController } from "@/controllers/auth.controller";
import { LoginDTO, RefreshDTO, RegisterDTO } from "@/dto/auth.dto";
import { authenticate } from "@/middlewares/auth.middlware";
import { validate } from "@/middlewares/validate.middleware";
import { Router } from "express";

const router = Router();

router.post("/register", validate(RegisterDTO), AuthController.register);
router.post("/login", validate(LoginDTO), AuthController.login);
router.post("/refresh", validate(RefreshDTO), AuthController.refresh);
router.post("/logout", authenticate, AuthController.logout);

export default router;
