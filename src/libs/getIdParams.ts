import { Request } from "express";

export const getIdParams = (req: Request, key: string) =>
  Number(req.params?.[key]);
