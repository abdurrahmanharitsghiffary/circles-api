"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("@/router");
const middlewares_1 = require("@/middlewares");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
(0, middlewares_1.rootMiddleware)(app);
const router = new router_1.Router(app);
router.v1();
exports.default = app;
//# sourceMappingURL=app.js.map