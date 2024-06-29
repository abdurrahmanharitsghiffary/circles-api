import moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAlias("@", path.join(__dirname, "../src"));

import express from "express";
import "reflect-metadata";
import { logger } from "@/libs/logger";
import { createServer } from "http";
import { ENV, NODE_ENV } from "@/config/env";
import { Router } from "@/router";
import { rootMiddleware } from "@/middlewares";

const app = express();

app.set("trust proxy", 1);
rootMiddleware(app);

const router = new Router(app);
router.v1();

const server = createServer(app);

async function main() {
  try {
    server.listen(ENV.PORT, () => {
      logger.info(`Running on ${NODE_ENV} environment.`);
      logger.info(`Listening on http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    logger.error(err);
  }
}

main();

export default app;
