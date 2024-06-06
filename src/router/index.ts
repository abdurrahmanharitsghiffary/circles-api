import { Express, Router as ExpressRouter } from "express";
import threadRouter from "./thread";
import userRouter from "./user";
import authRouter from "./auth";
import meRouter from "./me";
import repliesRouter from "./replies";
import { ErrorMiddleware } from "../middlewares/error";
import { NotFoundMiddleware } from "../middlewares/404";
import { loggerInterceptors } from "../middlewares/interceptors";

abstract class BaseRouter {
  protected static baseV1Url = "/api/v1";
  constructor(public app: Express) {}

  protected registerRouterV1(path: string, router: ExpressRouter) {
    return this.app.use(BaseRouter.baseV1Url + path, router);
  }
}

export class Router extends BaseRouter {
  v1() {
    const registerRouter: BaseRouter["registerRouterV1"] =
      this.registerRouterV1.bind(this);
    const app = this.app;

    app.use(loggerInterceptors);
    registerRouter("/me", meRouter);
    registerRouter("/threads", threadRouter);
    registerRouter("/users", userRouter);
    registerRouter("/auth", authRouter);
    registerRouter("/", repliesRouter);

    app.use(NotFoundMiddleware.use("handle"));
    app.use(ErrorMiddleware.handle);
  }
}
