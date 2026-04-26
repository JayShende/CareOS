// middlewares/validate.ts
import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: err.issues.map((issue) => issue.message), // ✅ only messages
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error - Zod",
      });
    }
  };