import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { env } from "@/config/env";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Error no operacional — bug real
  if (env.NODE_ENV === "development") {
    console.error("💥 ERROR:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      stack: err.stack,
    });
    return;
  }

  // En producción no exponemos detalles internos
  console.error("💥 ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
