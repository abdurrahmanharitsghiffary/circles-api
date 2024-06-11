import { getEnv } from "@/utils/env";

export const ENV = Object.freeze({
  PORT: Number(getEnv("PORT")) || 5000,
  LOG_LEVEL: getEnv("LOG_LEVEL") || "info",
  RT_COOKIE_KEY: getEnv("RT_COOKIE_KEY") || "clc.app.session",
  SALT: Number(getEnv("SALT")) || 10,
  BASE_URL: getEnv("BASE_URL"),
  COOKIE_SECRET: getEnv("COOKIE_SECRET"),
  IV: getEnv("IV"),
  ENCRYPTION_KEY: getEnv("ENCRYPTION_KEY"),
  CLIENT_BASE_URL: getEnv("CLIENT_BASE_URL"),
});

export const TP = Object.freeze({
  USER: getEnv("TP_USER"),
  PASS: getEnv("TP_PASS"),
  SERVICE: getEnv("TP_SERVICE"),
});

export const JWT = Object.freeze({
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES: getEnv("ACCESS_TOKEN_EXPIRES") || "1h",
  REFRESH_TOKEN_EXPIRES: getEnv("REFRESH_TOKEN_EXPIRES") || "7d",
});

export const NODE_ENV = getEnv("NODE_ENV");
