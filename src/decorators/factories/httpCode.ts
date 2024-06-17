import { Middleware } from "./middleware";

export function HttpCode(status: number) {
  return Middleware(async function (req, res, next) {
    res.status(status);
    return next();
  });
}
