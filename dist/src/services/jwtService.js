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
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@/config/env");
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 7,
};
class JWTService {
    static generateAccessToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                resolve(jsonwebtoken_1.default.sign(payload, env_1.JWT.ACCESS_TOKEN_SECRET, {
                    expiresIn: env_1.JWT.ACCESS_TOKEN_EXPIRES,
                }));
            });
        });
    }
    static verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT.ACCESS_TOKEN_SECRET);
                resolve(decoded);
            });
        });
    }
    static generateRefreshToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                resolve(jsonwebtoken_1.default.sign(payload, env_1.JWT.REFRESH_TOKEN_SECRET, {
                    expiresIn: env_1.JWT.REFRESH_TOKEN_EXPIRES,
                }));
            });
        });
    }
    static verifyRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT.REFRESH_TOKEN_SECRET);
                resolve(decoded);
            });
        });
    }
    static saveRefreshTokenToCookie(res, token) {
        res.cookie("clc.app.session", token, cookieOptions);
        res.cookie("clc.app.session", token, Object.assign(Object.assign({}, cookieOptions), { path: "/api/v1/auth/sign-out" }));
    }
    static clearRefreshTokenFromCookie(res) {
        res.clearCookie("clc.app.session", cookieOptions);
        res.clearCookie("clc.app.session", Object.assign(Object.assign({}, cookieOptions), { path: "/api/v1/auth/sign-out" }));
    }
}
exports.JWTService = JWTService;
//# sourceMappingURL=jwtService.js.map