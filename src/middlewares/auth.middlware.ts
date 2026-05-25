import { env } from "@/config/env";
import { UserModel } from "@/models/user.model";
import { AppError } from "@/utils/AppError";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("No autorizdo", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("No autorizdo", 401);
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await UserModel.findById(payload.sub);
    if (!user) {
      throw new AppError("No autorizado", 401);
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError("No autorizado", 401));
  }
};
