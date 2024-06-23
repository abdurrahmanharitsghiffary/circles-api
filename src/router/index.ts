import { Express } from "express";
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
import { AuthController } from "@/controllers/authController";
import { LikeController } from "@/controllers/likeController";
import { MeController } from "@/controllers/meController";
import { ReplyController } from "@/controllers/replyController";
import { ReplyLikeController } from "@/controllers/replyLikeController";
import { SearchController } from "@/controllers/searchController";
import { ThreadController } from "@/controllers/threadController";
import { UserController } from "@/controllers/userController";
import { tryCatch } from "@/middlewares/tryCatch";
import { NODE_ENV } from "@/config/env";
import { SpeechToTextController } from "@/controllers/speechToTextController";

export class Router {
  baseUrlV1 = "/api/v1";
  constructor(protected app: Express) {}

  v1() {
    const app = this.app;

    app.use(apiLogger);
    app.use(paginationParser());
    app.use(resJsonRedis({ EX: 60 }));
    if (!CONFIG.DISABLE_DOCS)
      app.use(
        this.baseUrlV1 + "/docs",
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
        SpeechToTextController,
        UserController,
      ],
      { prefix: this.baseUrlV1, debug: NODE_ENV === "development" }
    );

    app.use(tryCatch(NotFoundController.handle));
    app.use(ErrorMiddleware.handle);
  }
}
