import { Request } from "express";

export const parsePaging = (req: Request) => {
  const { limit = 20, offset = 0 } = req.query;

  return {
    limit: Number(limit),
    offset: Number(offset),
  };
};
