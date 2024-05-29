import { Express, Router as ExpressRouter } from "express";
import threadRouter from "./thread";
import { ErrorMiddleware } from "../middlewares/error";

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

    registerRouter("/threads", threadRouter);

    app.use(ErrorMiddleware.handle);
  }
}
