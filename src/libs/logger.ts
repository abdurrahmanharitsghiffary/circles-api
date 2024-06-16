import winston from "winston";
import { ENV } from "@/config/env";
import { AppRequest, AppResponse } from "@/types/express";
import { uaParser } from "./ua-parser";

const { json, prettyPrint, combine, timestamp, colorize, align, printf } =
  winston.format;

const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

const htttpLoggerFormat = combine(
  timestamp({ format: timestampFormat }),
  json(),
  prettyPrint({ colorize: true })
);

const loggerFormat = combine(
  colorize({ all: true }),
  timestamp({ format: timestampFormat }),
  align(),
  printf(
    ({ level, message, timestamp }) => `[${timestamp}] ${level}:${message}`
  )
);

export const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  format: loggerFormat,
  transports: [new winston.transports.Console()],
});

export const httpLogger = winston.createLogger({
  level: "http",
  format: htttpLoggerFormat,
  transports: [new winston.transports.Console()],
});

const sensitiveFields = [
  "password",
  "confirmPassword",
  "email",
  "newPassword",
  "currentPassword",
];

const redactBody = (body: Record<string, unknown>) => {
  const newBody: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      if (sensitiveFields.includes(key)) {
        newBody[key] = "****";
        continue;
      }
    } else if (value instanceof Object) {
      newBody[key] = redactBody(value as Record<string, unknown>);
      continue;
    }
    newBody[key] = value;
  }

  return newBody;
};

export const formatLogger = (
  req: AppRequest,
  res: AppResponse,
  body: Record<string, unknown>
) => {
  const ua = uaParser(req);
  return {
    route: req.originalUrl,
    method: req.method,
    statusCode: res.statusCode,
    headers: req.headers,
    ["req.body"]: redactBody(req.body),
    ["res.body"]: JSON.parse(JSON.stringify(redactBody(body))),
    userAgent: ua,
  };
};
