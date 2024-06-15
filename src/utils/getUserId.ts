import { AppRequest } from "@/types/express";

export const getUserId = (req: AppRequest) => {
  return req?.auth?.user?.id || -1;
};
