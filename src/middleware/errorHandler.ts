import { NextFunction, Request, Response } from "express";
import * as Celebrate from "celebrate";
import mongoose from "mongoose";
import { HttpError, BadRequestError } from "./errors";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Celebrate / Joi validation errors
  if ((Celebrate as any).isCelebrateError(err)) {
    const celebrateErr = err as any;
    const details: Record<string, any> = {};
    for (const [segment, value] of celebrateErr.details.entries()) {
      details[segment] = value.details.map((d: any) => d.message);
    }
    const message = "Invalid request payload";
    return res.status(400).json({ error: message, details });
  }

  // Mongoose validation error
  // @ts-ignore
  if (err && (err as any).name === "ValidationError") {
    // @ts-ignore
    const valErr = err as mongoose.Error.ValidationError;
    const details = Object.keys(valErr.errors).reduce((acc: any, k) => {
      // @ts-ignore
      acc[k] = valErr.errors[k].message;
      return acc;
    }, {});
    return res.status(400).json({ error: "Validation failed", details });
  }

  // Mongoose CastError (invalid ObjectId)
  // @ts-ignore
  if (err && (err as any).name === "CastError") {
    return res.status(400).json({ error: "Invalid product identifier" });
  }

  // Custom HttpError
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ error: err.message, details: err.details });
  }

  // Generic error fallback
  const message = err instanceof Error ? err.message : "Internal Server Error";
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: message });
};

export default errorHandler;
