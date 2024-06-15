import { AppRequest } from "@/types/express";

export const getPagingOptions = (req: AppRequest) => {
  const { limit = 20, offset = 0 } = req.query;

  return {
    limit: Number(limit),
    offset: Number(offset),
  };
};
