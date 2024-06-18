import { NextFunction, Request, Response } from "express";
import { SetOptions } from "redis";
import { ZAddOptions } from "./redis";
import { ApiResponse } from "@/libs/response";

export type BaseBody<T = unknown> = {
  cacheKey?: string;
  cacheOptions?: SetOptions;
  zAddOptions?: ZAddOptions;
  zAdd?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} & ApiResponse<T>;

type TypedResponse<T> = Omit<Response, "json" | "status"> & {
  json(data: T): TypedResponse<T>;
} & { status(code: number): TypedResponse<T> };

export type AppResponse<T = unknown> = TypedResponse<BaseBody<T>>;
export type AppRequest = Request;
export type AppHandler<T = unknown, ResBody = unknown> = (
  req: AppRequest,
  res: AppResponse<ResBody>,
  next: NextFunction
) => Promise<T> | void;
