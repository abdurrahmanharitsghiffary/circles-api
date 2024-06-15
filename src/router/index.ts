import { Express, Router as ExpressRouter, RequestHandler } from "express";
import threadRouter from "./thread";
import userRouter from "./user";
import authRouter from "./auth";
import meRouter from "./me";
import repliesRouter from "./replies";
import { ErrorMiddleware } from "../middlewares/error";
import { NotFoundMiddleware } from "../middlewares/404";
import { loggerInterceptors } from "../middlewares/interceptors";
import { SearchController } from "@/controllers/search";
import { apiLimiter } from "@/middlewares/limiter";
import swaggerUi from "swagger-ui-express";
import { specs } from "../../docs/specs";
import { paginationParser } from "@/middlewares/paginationParser";
import { fromCache } from "@/middlewares/fromCache";

type HTTPMethod = "get" | "patch" | "delete" | "put" | "post";

abstract class BaseRouter {
  protected static baseV1Url = "/api/v1";
  protected urlV1 = (path: string) => BaseRouter.baseV1Url + path;

  constructor(public app: Express) {}

  protected registerRouterV1(path: string, router: ExpressRouter) {
    return this.app.use(this.urlV1(path), router);
  }
  protected registerEndpointV1(
    method: HTTPMethod,
    path: string,
    controller: RequestHandler
  ) {
    return this.app[method](this.urlV1(path), controller);
  }
}

export class Router extends BaseRouter {
  v1() {
    const registerRouter: BaseRouter["registerRouterV1"] =
      this.registerRouterV1.bind(this);
    const app = this.app;

    app.use(loggerInterceptors);
    app.use(paginationParser());
    app.use(fromCache());
    app.use(
      BaseRouter.baseV1Url + "/docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );
    app.use(apiLimiter);
    this.registerEndpointV1("get", "/search", SearchController.use());

    registerRouter("/me", meRouter);
    registerRouter("/threads", threadRouter);
    registerRouter("/users", userRouter);
    registerRouter("/auth", authRouter);
    registerRouter("/", repliesRouter);

    app.use(NotFoundMiddleware.use("handle"));
    app.use(ErrorMiddleware.handle);
  }
}
