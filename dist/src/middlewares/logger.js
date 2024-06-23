"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLogger = void 0;
const logger_1 = require("@/libs/logger");
const env_1 = require("@/config/env");
const config_1 = require("@/config");
const apiLogger = (req, res, next) => {
    const originalResJson = res.json;
    const ip = req.clientIp;
    let resSended = false;
    if (env_1.NODE_ENV !== "development" || !config_1.CONFIG.ENABLE_LOGGING)
        return next();
    logger_1.httpLogger.profile("response");
    res.json = function (body) {
        if (!resSended) {
            if (res.statusCode < 400) {
                logger_1.httpLogger.profile("response", Object.assign(Object.assign({}, (0, logger_1.formatLogger)(req, res, body)), { level: "http", ip }));
            }
            else {
                logger_1.httpLogger.profile("response", Object.assign(Object.assign({}, (0, logger_1.formatLogger)(req, res, body)), { level: "error", ip }));
            }
            resSended = true;
        }
        return originalResJson.call(this, body);
    };
    next();
};
exports.apiLogger = apiLogger;
//# sourceMappingURL=logger.js.map