import { ENV } from "@/config/env";
import { createClient } from "redis";

export const redisClient = createClient({ url: ENV.REDIS_URL });

(async () => {
  await redisClient.connect();
})();

redisClient.on("error", (err) => console.error("REDIS ERROR: ", err));
redisClient.on("connect", () => {
  console.log("Redis connected.");
});
