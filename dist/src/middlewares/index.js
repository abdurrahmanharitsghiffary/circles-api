"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const request_ip_1 = require("request-ip");
const env_1 = require("@/config/env");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const whitelist = ["http://localhost:5173", "http://localhost:4173"];
const rootMiddleware = (app) => {
    app.use((0, request_ip_1.mw)());
    app.use((0, helmet_1.default)({ crossOriginEmbedderPolicy: false }));
    app.use((0, cors_1.default)({
        credentials: true,
        origin: function (origin, callback) {
            if (env_1.NODE_ENV === "development")
                return callback(null, true);
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    }));
    app.use((0, cookie_parser_1.default)(env_1.ENV.COOKIE_SECRET));
    app.use(passport_1.default.initialize());
    app.use((0, express_session_1.default)({
        secret: env_1.ENV.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }));
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
};
exports.rootMiddleware = rootMiddleware;
//# sourceMappingURL=index.js.map