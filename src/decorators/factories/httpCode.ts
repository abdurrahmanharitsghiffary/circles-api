import { Request, Response } from "express";
import { MethodDecorator } from "..";

export function HttpCode(status: number) {
  return MethodDecorator(async (req: Request, res: Response) => {
    res.status(status);
  });
}
