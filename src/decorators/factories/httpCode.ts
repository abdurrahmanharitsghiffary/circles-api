import { MiddlewareDecorator } from "..";

export function HttpCode(status: number) {
  return MiddlewareDecorator(async function (req, res, next) {
    res.status(status);
    return next();
  });
}
