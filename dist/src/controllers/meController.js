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
exports.MeController = void 0;
const authorize_1 = require("@/decorators/factories/authorize");
const userService_1 = __importDefault(require("@/services/userService"));
const response_1 = require("@/libs/response");
const threadService_1 = __importDefault(require("@/services/threadService"));
const replyService_1 = require("@/services/replyService");
const validate_1 = require("@/decorators/factories/validate");
const paging_1 = require("@/schema/paging");
const user_1 = require("@/schema/user");
const uploadImage_1 = require("@/decorators/factories/uploadImage");
const omitProperties_1 = require("@/utils/omitProperties");
const cloudinary_1 = require("@/utils/cloudinary");
const genRandToken_1 = require("@/utils/genRandToken");
const models_1 = require("@/models");
const env_1 = require("@/config/env");
const nodemailer_1 = require("@/libs/nodemailer");
const joi_1 = __importDefault(require("joi"));
const error_1 = require("@/libs/error");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("@/schema/auth");
let MeController = class MeController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const user = yield userService_1.default.findBy("id", userId);
            return res.json(new response_1.Success((0, omitProperties_1.omitProperties)(user, ["password"])));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { bio, firstName, lastName, username } = req.body;
            let { photoProfile, coverPicture } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadFileFields(req);
            if (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.photoProfile)
                photoProfile = uploadedImages.photoProfile;
            if (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.coverPicture)
                coverPicture = uploadedImages.coverPicture;
            yield userService_1.default.update(userId, {
                bio,
                firstName,
                lastName,
                photoProfile,
                username,
                coverPicture,
            });
            return res
                .status(204)
                .json(new response_1.NoContent("Successfully update user informations."));
        });
    }
    threads(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const paginationOptions = req.pagination;
            const [threads, count] = yield threadService_1.default.findByUserId(loggedUserId, paginationOptions, loggedUserId);
            return res.json(new response_1.ApiPagingResponse(req, threads, count));
        });
    }
    replies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const paginationOptions = req.pagination;
            const [replies, count] = yield replyService_1.ReplyService.findByUserId(loggedUserId, paginationOptions);
            return res.json(new response_1.ApiPagingResponse(req, replies, count));
        });
    }
    likes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const paginationOptions = req.pagination;
            const [likedThreads, count] = yield threadService_1.default.findLikedByUserId(loggedUserId, paginationOptions, loggedUserId);
            return res.json(new response_1.ApiPagingResponse(req, likedThreads, count));
        });
    }
    followers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const paginationOptions = req.pagination;
            const [followers, count] = yield userService_1.default.findFollowings(loggedUserId, loggedUserId, "followers", paginationOptions);
            return res.json(new response_1.ApiPagingResponse(req, followers, count));
        });
    }
    following(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const paginationOptions = req.pagination;
            const [following, count] = yield userService_1.default.findFollowings(loggedUserId, loggedUserId, "following", paginationOptions);
            return res.json(new response_1.ApiPagingResponse(req, following, count));
        });
    }
    requestVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const user = yield models_1.User.findUnique({ where: { id: userId } });
            if (user.isVerified)
                throw new error_1.RequestError("Account already verified.", 400);
            const randToken = yield (0, genRandToken_1.genRandToken)();
            const verifyToken = yield models_1.Token.create({
                data: {
                    token: randToken,
                    expiresAt: 1000 * 60 * 5,
                    type: "VERIFY_TOKEN",
                    userId,
                },
                include: { user: { select: { email: true } } },
            });
            const verifyUrl = `${env_1.ENV.CLIENT_BASE_URL}/me/verify-account/${verifyToken.token}`;
            (0, nodemailer_1.sendVerifyEmailLink)(verifyToken.user.email, verifyUrl);
            return res.json(new response_1.Success(null, "If your email is valid, verification request will been sent to your email. please check your inbox and follow the instruction to verify your account."));
        });
    }
    verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const verifyToken = yield models_1.Token.findUnique({
                where: { token, type: "VERIFY_TOKEN" },
            });
            if (!verifyToken)
                throw new error_1.RequestError("Invalid token.", 400);
            const createdAt = new Date(verifyToken.createdAt);
            const expiresAt = new Date(createdAt.getTime() + verifyToken.expiresAt);
            const isExpired = expiresAt.getTime() < Date.now();
            if (isExpired) {
                yield models_1.Token.delete({ where: { id: verifyToken.id } });
                throw new error_1.RequestError("Token already expired. please submit another verification request.", 400);
            }
            const user = yield models_1.User.update({
                where: { id: verifyToken.userId },
                data: { isVerified: true },
            });
            yield models_1.Token.deleteMany({
                where: { userId: verifyToken.userId, type: "VERIFY_TOKEN" },
            });
            (0, nodemailer_1.sendSuccessfulVerifyAccount)(user.email);
            return res.json(new response_1.Success(null, "Account successfully verified."));
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPassword, newPassword } = req.body;
            const user = yield models_1.User.findUnique({
                where: { id: req.userId },
                select: { email: true, password: true },
            });
            const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isMatch)
                throw new error_1.RequestError("Incorrect password.", 400);
            yield userService_1.default.update(req.userId, { password: newPassword });
            (0, nodemailer_1.sendSuccessfulChangePassword)(user.email);
            return res
                .status(204)
                .json(new response_1.NoContent("Password successfully changed."));
        });
    }
};
exports.MeController = MeController;
__decorate([
    (0, httpMethod_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "index", null);
__decorate([
    (0, httpMethod_1.Patch)("/"),
    (0, uploadImage_1.UploadImage)("fields", [
        { name: "photoProfile", maxCount: 1 },
        { name: "coverPicture", maxCount: 1 },
    ]),
    (0, validate_1.Validate)({ body: user_1.updateUserSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "update", null);
__decorate([
    (0, httpMethod_1.Get)("/threads"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "threads", null);
__decorate([
    (0, httpMethod_1.Get)("/replies"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "replies", null);
__decorate([
    (0, httpMethod_1.Get)("/threads/liked"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "likes", null);
__decorate([
    (0, httpMethod_1.Get)("/followers"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "followers", null);
__decorate([
    (0, httpMethod_1.Get)("/following"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "following", null);
__decorate([
    (0, httpMethod_1.Post)("/verify-account"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "requestVerify", null);
__decorate([
    (0, httpMethod_1.Post)("/verify-account/:token"),
    (0, validate_1.Validate)({ params: joi_1.default.object({ token: joi_1.default.string().required() }) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "verifyAccount", null);
__decorate([
    (0, httpMethod_1.Patch)("/change-password"),
    (0, validate_1.Validate)({ body: auth_1.changePaswordSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "changePassword", null);
exports.MeController = MeController = __decorate([
    (0, controller_1.Controller)("/me"),
    (0, authorize_1.Authorize)()
], MeController);
//# sourceMappingURL=meController.js.map