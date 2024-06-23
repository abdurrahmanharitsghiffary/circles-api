"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AuthController = void 0;
const validate_1 = require("@/decorators/factories/validate");
const auth_1 = require("@/schema/auth");
const authService_1 = require("@/services/authService");
const response_1 = require("@/libs/response");
const error_1 = require("@/libs/error");
const refreshTokenService_1 = require("@/services/refreshTokenService");
const userService_1 = __importDefault(require("@/services/userService"));
const jwtService_1 = require("@/services/jwtService");
const joi_1 = __importDefault(require("joi"));
const schema_1 = require("@/schema");
const genRandToken_1 = require("@/utils/genRandToken");
const models_1 = require("@/models");
const nodemailer_1 = require("@/libs/nodemailer");
const consts_1 = require("@/libs/consts");
const env_1 = require("@/config/env");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
const middleware_1 = require("@/decorators/factories/middleware");
const limiter_1 = require("@/middlewares/limiter");
let AuthController = class AuthController {
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const { accessToken, refreshToken, user } = yield authService_1.AuthService.signIn({
                email,
                password,
            });
            jwtService_1.JWTService.saveRefreshTokenToCookie(res, refreshToken);
            yield refreshTokenService_1.RefreshTokenService.create({ token: refreshToken, userId: user.id });
            return res.json(new response_1.Success({ accessToken }, "Successfully sign in to your account."));
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, username, lastName } = req.body;
            const { accessToken, refreshToken, user } = yield authService_1.AuthService.signUp({
                email,
                password,
                firstName,
                username,
                lastName,
            });
            jwtService_1.JWTService.saveRefreshTokenToCookie(res, refreshToken);
            yield refreshTokenService_1.RefreshTokenService.create({ token: refreshToken, userId: user.id });
            return res.json(new response_1.Success({ accessToken }, "Account successfully registered."));
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies["clc.app.session"];
            if (!refreshToken)
                throw new error_1.UnauthenticatedError();
            const token = yield refreshTokenService_1.RefreshTokenService.find(refreshToken);
            if (!token)
                throw new error_1.UnauthenticatedError();
            const decoded = yield jwtService_1.JWTService.verifyRefreshToken(refreshToken);
            if (!decoded)
                throw new error_1.UnauthorizedError("Invalid refresh token.");
            const user = yield userService_1.default.findBy("id", token.userId);
            const accessToken = yield jwtService_1.JWTService.generateAccessToken({
                firstName: user.firstName,
                id: user.id,
                lastName: user.lastName,
                coverPicture: user.coverPicture,
                photoProfile: user.photoProfile,
                role: user.role,
                username: user.username,
            });
            return res
                .status(200)
                .json(new response_1.Success({ accessToken }, "Successfully issued new access token."));
        });
    }
    signOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield authService_1.AuthService.signOut(req, res);
            return res
                .status(200)
                .json(new response_1.Success("Successfully signed out from account."));
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const randToken = yield (0, genRandToken_1.genRandToken)();
                const user = yield models_1.User.findUnique({ where: { email } });
                if (!user.isVerified || !user)
                    throw new Error("cuma buat throw ke catch block");
                yield models_1.Token.create({
                    data: {
                        token: randToken,
                        type: "RESET_TOKEN",
                        expiresAt: 1000 * 60 * 5,
                        userId: user.id,
                    },
                });
                (0, nodemailer_1.sendResetPasswordLink)({
                    fullName: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                    to: email,
                    url: `${env_1.ENV.CLIENT_BASE_URL}/auth/reset-password/${randToken}`,
                });
                return res.json(new response_1.Success(null, consts_1.MESSAGE.resetPassword));
            }
            catch (err) {
                return res.json(new response_1.Success(null, consts_1.MESSAGE.resetPassword));
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const { newPassword } = req.body;
            const resetToken = yield models_1.Token.findUnique({
                where: { token, type: "RESET_TOKEN" },
            });
            if (!resetToken)
                throw new error_1.RequestError("Invalid token.", 400);
            const createdAt = new Date(resetToken.createdAt);
            const expiredAt = new Date(createdAt.getTime() + resetToken.expiresAt);
            const isExpired = expiredAt.getTime() < Date.now();
            if (isExpired) {
                yield models_1.Token.delete({ where: { id: resetToken.id } });
                throw new error_1.RequestError("Token already expired, please submit another request to reset your password.", 400);
            }
            const user = yield userService_1.default.update(resetToken.userId, {
                password: newPassword,
            });
            yield models_1.Token.deleteMany({
                where: { userId: resetToken.userId, type: "RESET_TOKEN" },
            });
            (0, nodemailer_1.sendSuccessfulResetPassword)(user.email);
            yield authService_1.AuthService.signOut(req, res, false);
            return res
                .status(204)
                .json(new response_1.NoContent("Password successfully changed, please sign in again to your account."));
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, httpMethod_1.Post)("/sign-in"),
    (0, middleware_1.Middleware)(limiter_1.signInLimiter),
    (0, validate_1.Validate)({ body: auth_1.signInSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, httpMethod_1.Post)("/sign-up"),
    (0, middleware_1.Middleware)(limiter_1.signUpLimiter),
    (0, validate_1.Validate)({ body: auth_1.signUpSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, httpMethod_1.Post)("/refresh"),
    (0, middleware_1.Middleware)(limiter_1.refreshTokenLimiter),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, httpMethod_1.Post)("/sign-out"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOut", null);
__decorate([
    (0, httpMethod_1.Post)("/forgot-password"),
    (0, middleware_1.Middleware)(limiter_1.forgotPasswordLimiter),
    (0, validate_1.Validate)({ body: joi_1.default.object({ email: schema_1.J.email.required() }) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, httpMethod_1.Post)("/reset-password/:token"),
    (0, validate_1.Validate)({
        body: auth_1.resetPasswordSchema,
        params: joi_1.default.object({ token: joi_1.default.string().required() }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, controller_1.Controller)("/auth")
], AuthController);
//# sourceMappingURL=authController.js.map