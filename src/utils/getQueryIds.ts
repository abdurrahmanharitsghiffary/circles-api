import { AppRequest } from "@/types/express";

export const getQueryIds = (req: AppRequest, key: string = "id") => {
  const queryId = ((req.query?.[key] as string) ?? "").split(",");
  const ids = queryId.map((id) => Number(id.trim()) || -1);

  return ids;
};
