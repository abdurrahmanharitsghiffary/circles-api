import winston from "winston";
import { ENV } from "@/config/env";
import { AppRequest, AppResponse } from "@/types/express";

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

const sensitiveFields = ["password", "confirmPassword", "email"];

const redactBody = (body: unknown) => {
  const newBody: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (sensitiveFields.includes(key)) {
      newBody[key] = "****";
    }
    newBody[key] = value;
  }

  return newBody;
};

export const formatLogger = (
  req: AppRequest,
  res: AppResponse,
  body: unknown
) => ({
  route: req.originalUrl,
  method: req.method,
  statusCode: res.statusCode,
  headers: req.headers,
  body: JSON.parse(JSON.stringify(redactBody(body))),
});
