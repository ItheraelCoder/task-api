import type { LoginInput, RefreshInput, RegisterInput } from "@/dto/auth.dto";
import { AuthService } from "@/services/auth.service";
import { catchAsync } from "@/utils/catchAsync";
import type { Request, Response } from "express";

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const input = req.body as RegisterInput;
    const result = await AuthService.register(input);
    res.status(201).json({ status: "success", data: result });
  }),
  login: catchAsync(async (req: Request, res: Response) => {
    const input = req.body as LoginInput;
    const result = await AuthService.login(input);
    res.status(200).json({ status: "success", data: result });
  }),

  refresh: catchAsync(async (req: Request, res: Response) => {
    const input = req.body as RefreshInput;
    const result = await AuthService.refresh(input);
    res.status(200).json({ status: "success", data: result });
  }),
  logout: catchAsync(async (req: Request, res: Response) => {
    await AuthService.logout(req.user!.id);
    res.status(200).json({ status: "success", message: "Sesion Cerrada" });
  }),
};
