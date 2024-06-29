"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.JWT = exports.TP = exports.ENV = void 0;
const env_1 = require("@/utils/env");
exports.ENV = Object.freeze({
    SESSION_SECRET: (0, env_1.getEnv)("SESSION_SECRET"),
    PORT: Number((0, env_1.getEnv)("PORT")) || 5000,
    LOG_LEVEL: (0, env_1.getEnv)("LOG_LEVEL") || "info",
    RT_COOKIE_KEY: (0, env_1.getEnv)("RT_COOKIE_KEY") || "clc.app.session",
    SALT: Number((0, env_1.getEnv)("SALT")) || 10,
    BASE_URL: (0, env_1.getEnv)("BASE_URL"),
    COOKIE_SECRET: (0, env_1.getEnv)("COOKIE_SECRET"),
    IV: (0, env_1.getEnv)("IV"),
    ENCRYPTION_KEY: (0, env_1.getEnv)("ENCRYPTION_KEY"),
    CLIENT_BASE_URL: (0, env_1.getEnv)("CLIENT_BASE_URL"),
    REDIS_URL: (0, env_1.getEnv)("REDIS_URL"),
    REDIS_PASS: (0, env_1.getEnv)("REDIS_PASS"),
    OAUTH: {
        GOOGLE_CLIENT_ID: (0, env_1.getEnv)("GOOGLE_CLIENT_ID"),
        GOOGLE_CLIENT_SECRET: (0, env_1.getEnv)("GOOGLE_CLIENT_SECRET"),
        FACEBOOK_CLIENT_ID: (0, env_1.getEnv)("FACEBOOK_CLIENT_ID"),
        FACEBOOK_CLIENT_SECRET: (0, env_1.getEnv)("FACEBOOK_CLIENT_SECRET"),
        TWITTER_CLIENT_KEY: (0, env_1.getEnv)("TWITTER_CLIENT_KEY"),
        TWITTER_CLIENT_SECRET: (0, env_1.getEnv)("TWITTER_CLIENT_SECRET"),
    },
});
exports.TP = Object.freeze({
    USER: (0, env_1.getEnv)("TP_USER"),
    PASS: (0, env_1.getEnv)("TP_PASS"),
    SERVICE: (0, env_1.getEnv)("TP_SERVICE"),
});
exports.JWT = Object.freeze({
    ACCESS_TOKEN_SECRET: (0, env_1.getEnv)("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: (0, env_1.getEnv)("REFRESH_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRES: (0, env_1.getEnv)("ACCESS_TOKEN_EXPIRES") || "1h",
    REFRESH_TOKEN_EXPIRES: (0, env_1.getEnv)("REFRESH_TOKEN_EXPIRES") || "7d",
});
exports.NODE_ENV = (0, env_1.getEnv)("NODE_ENV");
//# sourceMappingURL=env.js.map