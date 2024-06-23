"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = require("@/router");
const request_ip_1 = require("request-ip");
const env_1 = require("@/config/env");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, request_ip_1.mw)());
app.use((0, helmet_1.default)({ crossOriginEmbedderPolicy: false }));
app.use((0, cors_1.default)({ credentials: true, origin: env_1.ENV.CLIENT_BASE_URL }));
app.use((0, cookie_parser_1.default)(env_1.ENV.COOKIE_SECRET));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const router = new router_1.Router(app);
router.v1();
exports.default = app;
//# sourceMappingURL=app.js.map