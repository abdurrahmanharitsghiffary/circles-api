import { AppHandler, AppRequest, AppResponse } from "@/types/express";
import { NextFunction } from "express";

export function tryCatch(controller: AppHandler) {
  return async (req: AppRequest, res: AppResponse, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
