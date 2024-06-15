import { AppRequest, AppResponse } from "@/types/express";
import { getPagingOptions } from "@/utils/getPagingOptions";
import { NextFunction } from "express";

export const paginationParser =
  () => async (req: AppRequest, res: AppResponse, next: NextFunction) => {
    req.pagination = getPagingOptions(req);
    return next();
  };
