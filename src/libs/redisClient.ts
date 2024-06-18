import { ENV } from "@/config/env";
import { createClient } from "redis";

export const redisClient = createClient({
  url: ENV.REDIS_URL,
  password: ENV.REDIS_PASS,
});

(async () => {
  await redisClient.connect();
})();

redisClient.on("error", (err) => {
  console.error("REDIS ERROR: ", err);
});
redisClient.on("connect", () => {
  console.log("Redis connected.");
});
