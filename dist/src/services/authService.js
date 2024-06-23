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
exports.AuthService = void 0;
const consts_1 = require("@/libs/consts");
const error_1 = require("@/libs/error");
const userService_1 = __importDefault(require("./userService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const jwtService_1 = require("./jwtService");
const refreshTokenService_1 = require("./refreshTokenService");
const env_1 = require("@/config/env");
class AuthService {
    static verifyAuth(req_1, next_1) {
        return __awaiter(this, arguments, void 0, function* (req, next, optional = false) {
            var _a, _b, _c, _d, _e, _f;
            const authorization = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) !== null && _b !== void 0 ? _b : "";
            const [tokenType, token] = authorization.split(" ");
            if (!token && optional)
                return next();
            if (!token)
                throw new error_1.UnauthenticatedError("No token provided.");
            if (tokenType !== "Bearer")
                throw new error_1.UnauthenticatedError("Invalid token type.");
            try {
                const decodedToken = yield jwtService_1.JWTService.verifyAccessToken(token);
                delete decodedToken.iat;
                delete decodedToken.exp;
                req.auth = {
                    isLoggedIn: true,
                    user: decodedToken,
                };
                req.userId = ((_d = (_c = req === null || req === void 0 ? void 0 : req.auth) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id) || -1;
                return next();
            }
            catch (err) {
                const isTokenErrorButOptionalAuthorization = (err instanceof jsonwebtoken_1.TokenExpiredError ||
                    err instanceof jsonwebtoken_1.JsonWebTokenError) &&
                    optional;
                req.userId = ((_f = (_e = req === null || req === void 0 ? void 0 : req.auth) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.id) || -1;
                if (isTokenErrorButOptionalAuthorization)
                    return next();
                throw err;
            }
        });
    }
    static signUp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, username, firstName, password, lastName, }) {
            const createdUser = yield userService_1.default.create({
                email,
                firstName,
                password,
                username,
                lastName,
            });
            const role = yield userService_1.default.getRole(createdUser.id);
            const accessToken = yield jwtService_1.JWTService.generateAccessToken({
                id: createdUser.id,
                photoProfile: createdUser.photoProfile,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                username: createdUser.username,
                role,
            });
            const refreshToken = yield jwtService_1.JWTService.generateRefreshToken({
                id: createdUser.id,
                role,
            });
            return { accessToken, refreshToken, user: createdUser };
        });
    }
    static signIn(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield userService_1.default.findBy("email", email, false);
            if (!user)
                throw new error_1.RequestError(consts_1.ERROR_MESSAGE.invalidCredentials, 400);
            const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordMatch)
                throw new error_1.RequestError(consts_1.ERROR_MESSAGE.invalidCredentials, 400);
            const accessToken = yield jwtService_1.JWTService.generateAccessToken({
                id: user.id,
                role: user.role,
                coverPicture: user.coverPicture,
                photoProfile: user.photoProfile,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            });
            const refreshToken = yield jwtService_1.JWTService.generateRefreshToken({
                id: user.id,
                role: user.role,
            });
            return { accessToken, refreshToken, user };
        });
    }
    static signOut(req_1, res_1) {
        return __awaiter(this, arguments, void 0, function* (req, res, isThrowError = true) {
            const refreshToken = req.cookies[env_1.ENV.RT_COOKIE_KEY];
            if (!refreshToken && isThrowError)
                throw new error_1.UnauthenticatedError();
            jwtService_1.JWTService.clearRefreshTokenFromCookie(res);
            if (!isThrowError && !refreshToken)
                return;
            yield refreshTokenService_1.RefreshTokenService.delete(refreshToken);
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map