import { Request } from "express";

export const getParamsId = (req: Request, key: string = "id") =>
  Number(req.params?.[key]) || -1;
