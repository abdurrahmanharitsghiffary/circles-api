import { AppRequest } from "@/types/express";

export const getParamsId = (req: AppRequest, key: string = "id") =>
  Number(req.params?.[key]) || -1;
