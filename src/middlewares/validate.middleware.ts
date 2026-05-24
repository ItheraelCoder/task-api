import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = z.flattenError(result.error).fieldErrors;
      res.status(400).json({
        status: "error",
        message: "Datos inválidos",
        errors,
      });
      return;
    }

    const validateData = result.data as any;

    if (validateData.body) {
      req.body = validateData.body;
    }

    if (validateData.query) {
      Object.assign(req.query, validateData.query);
    }

    if (validateData.params) {
      Object.assign(req.params, validateData.params);
    }

    // req.body = validateData.body ?? req.body;
    // req.query = validateData.query ?? req.query;
    // req.params = validateData.params ?? req.params;

    next();
  };
