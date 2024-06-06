import { Request } from "express";

export const getQueryIds = (req: Request, key: string = "id") => {
  const queryId = ((req.query?.[key] as string) ?? "").split(",");
  const ids = queryId.map((id) => Number(id.trim()) || -1);

  return ids;
};
