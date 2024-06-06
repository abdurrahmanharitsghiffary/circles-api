import { Request } from "express";

export const getUserId = (req: Request) => {
  return req?.auth?.user?.id || -1;
};
