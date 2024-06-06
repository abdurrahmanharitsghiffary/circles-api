import { Request } from "express";

export const getIp = (req: Request) => {
  const forwarded = req?.headers?.["x-fordwarded-for"];
  return forwarded ? forwarded.toString().split(",")?.[0] : req?.ip;
};
