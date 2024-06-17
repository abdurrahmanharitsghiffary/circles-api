import { Express, Router as ExpressRouter, RequestHandler } from "express";
import { ErrorMiddleware } from "../middlewares/error";
import { NotFoundController } from "../middlewares/404";
import { apiLogger } from "../middlewares/logger";
import { apiLimiter } from "@/middlewares/limiter";
import swaggerUi from "swagger-ui-express";
import { specs } from "../../docs/specs";
import { paginationParser } from "@/middlewares/paginationParser";
import { resJsonRedis } from "@/middlewares/resJsonRedis";
import { CONFIG } from "@/config";
import { registerController } from "@/utils/registerController";
import { AuthController } from "@/controllers/auth";
import { LikeController } from "@/controllers/like";
import { MeController } from "@/controllers/me";
import { ReplyController } from "@/controllers/reply";
import { ReplyLikeController } from "@/controllers/replyLike";
import { SearchController } from "@/controllers/search";
import { ThreadController } from "@/controllers/thread";
import { UserController } from "@/controllers/user";
import { tryCatch } from "@/middlewares/tryCatch";

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
    const app = this.app;

    app.use(apiLogger);
    app.use(paginationParser());
    app.use(resJsonRedis({ EX: 60 }));
    if (!CONFIG.DISABLE_DOCS)
      app.use(
        BaseRouter.baseV1Url + "/docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, { explorer: true })
      );
    app.use(apiLimiter);

    registerController(
      app,
      [
        AuthController,
        LikeController,
        MeController,
        ReplyController,
        ReplyLikeController,
        SearchController,
        ThreadController,
        UserController,
      ],
      { prefix: "/api/v1" }
    );

    app.use(tryCatch(NotFoundController.handle));
    app.use(ErrorMiddleware.handle);
  }
}
