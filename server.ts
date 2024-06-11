import "module-alias/register";
import app from "./app";
import { logger } from "./src/libs/logger";
import { createServer } from "http";
import { ENV, NODE_ENV } from "@/config/env";

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
