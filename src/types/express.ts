import { Request, Response } from "express";
import { SetOptions } from "redis";

export type BaseBody = {
  cacheKey?: string;
  cacheOptions?: SetOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type TypedResponse<T> = Omit<Response, "json" | "status"> & {
  json(data: T): TypedResponse<T>;
} & { status(code: number): TypedResponse<T> };

export type AppResponse = TypedResponse<BaseBody>;
export type AppRequest = Request;
