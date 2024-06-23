"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const response_1 = require("@/libs/response");
const joi_1 = __importDefault(require("joi"));
const env_1 = require("@/config/env");
const jsonwebtoken_1 = require("jsonwebtoken");
class ErrorMiddleware {
    static handle(err, req, res, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = (err === null || err === void 0 ? void 0 : err.status) || 400;
                const message = (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong.";
                const name = env_1.NODE_ENV === "development" ? err === null || err === void 0 ? void 0 : err.name : undefined;
                if (err instanceof joi_1.default.ValidationError) {
                    return res
                        .status(422)
                        .json(new response_1.ApiResponse(null, 422, message, name, err === null || err === void 0 ? void 0 : err.details));
                }
                else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                    if (name === "TokenExpiredError") {
                        return res
                            .status(401)
                            .json(new response_1.ApiResponse(null, 401, "Access token expired.", name));
                    }
                    return res
                        .status(401)
                        .json(new response_1.ApiResponse(null, 401, "Invalid token.", name));
                }
                return res
                    .status(status)
                    .json(new response_1.ApiResponse(null, status, message, name));
            }
            catch (err) {
                res
                    .status(500)
                    .json(new response_1.ApiResponse(null, 500, "Internal Server Error!"));
            }
        });
    }
}
exports.ErrorMiddleware = ErrorMiddleware;
//# sourceMappingURL=error.js.map