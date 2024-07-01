import { NODE_ENV } from "./env";

export const CONFIG = {
  ENABLE_LOGGING: NODE_ENV === "production",
  INFINITY_LIMITER: true,
  DISABLE_DOCS: true,
  DISABLE_CACHE: false,
  REDIS_ERROR_LOG: false,
};
