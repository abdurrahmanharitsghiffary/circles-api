import winston from "winston";
import { getEnv } from "@/utils/env";
import { Request, Response } from "express";

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
  level: getEnv("LOG_LEVEL") || "info",
  format: loggerFormat,
  transports: [new winston.transports.Console()],
});

export const httpLogger = winston.createLogger({
  level: "http",
  format: htttpLoggerFormat,
  transports: [new winston.transports.Console()],
});

const sensitiveFields = ["password", "confirmPassword", "email"];

const redactBody = (body: any) => {
  const newBody: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (sensitiveFields.includes(key)) {
      newBody[key] = "****";
    }
    newBody[key] = value;
  }

  return newBody;
};

export const formatLogger = (req: Request, res: Response, body: any) => ({
  route: req.originalUrl,
  method: req.method,
  statusCode: res.statusCode,
  headers: req.headers,
  body: JSON.parse(JSON.stringify(redactBody(body))),
});
