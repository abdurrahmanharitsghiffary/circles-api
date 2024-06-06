import "module-alias/register";
import app from "./app";
import { NODE_ENV } from "./src/libs/consts";
import { getEnv } from "./src/utils/env";
import { logger } from "./src/libs/logger";
import { createServer } from "http";

const server = createServer(app);
const PORT = getEnv("PORT") || 5000;

async function main() {
  try {
    server.listen(PORT, () => {
      logger.info(`Running on ${NODE_ENV} environment.`);
      logger.info(`Listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error(err);
  }
}

main();
