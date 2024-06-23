"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLogger = exports.httpLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("@/config/env");
const ua_parser_1 = require("./ua-parser");
const { json, prettyPrint, combine, timestamp, colorize, align, printf } = winston_1.default.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
const htttpLoggerFormat = combine(timestamp({ format: timestampFormat }), json(), prettyPrint({ colorize: true }));
const loggerFormat = combine(colorize({ all: true }), timestamp({ format: timestampFormat }), align(), printf(({ level, message, timestamp }) => `[${timestamp}] ${level}:${message}`));
exports.logger = winston_1.default.createLogger({
    level: env_1.ENV.LOG_LEVEL,
    format: loggerFormat,
    transports: [new winston_1.default.transports.Console()],
});
exports.httpLogger = winston_1.default.createLogger({
    level: "http",
    format: htttpLoggerFormat,
    transports: [new winston_1.default.transports.Console()],
});
const sensitiveFields = [
    "password",
    "confirmPassword",
    "email",
    "newPassword",
    "currentPassword",
];
const redactBody = (body) => {
    const newBody = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
            if (sensitiveFields.includes(key)) {
                newBody[key] = "****";
                continue;
            }
        }
        else if (value instanceof Object) {
            newBody[key] = redactBody(value);
            continue;
        }
        newBody[key] = value;
    }
    return newBody;
};
const formatLogger = (req, res, body) => {
    const ua = (0, ua_parser_1.uaParser)(req);
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
exports.formatLogger = formatLogger;
//# sourceMappingURL=logger.js.map