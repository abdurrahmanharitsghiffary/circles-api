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
exports.UserController = void 0;
const userService_1 = __importDefault(require("@/services/userService"));
const response_1 = require("@/libs/response");
const getParamsId_1 = require("@/utils/getParamsId");
const authorize_1 = require("@/decorators/factories/authorize");
const validate_1 = require("@/decorators/factories/validate");
const user_1 = require("@/schema/user");
const schema_1 = require("@/schema");
const uploadImage_1 = require("@/decorators/factories/uploadImage");
const paging_1 = require("@/schema/paging");
const cloudinary_1 = require("@/utils/cloudinary");
const controller_1 = require("@/decorators/factories/controller");
const threadService_1 = __importDefault(require("@/services/threadService"));
const httpMethod_1 = require("@/decorators/factories/httpMethod");
let UserController = class UserController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const paginationOptions = req.pagination;
            const [users, count] = yield userService_1.default.findAll(paginationOptions, userId);
            return res.status(200).json(new response_1.ApiPagingResponse(req, users, count));
        });
    }
    suggestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const users = yield userService_1.default.suggestion(loggedUserId);
            return res.status(200).json(new response_1.Success(users));
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, getParamsId_1.getParamsId)(req);
            const loggedUserId = req.userId;
            const user = yield userService_1.default.find(userId, loggedUserId);
            return res.status(200).json(new response_1.Success(user));
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, firstName, password, username, bio, lastName } = req.body;
            let { photoProfile, coverPicture } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadFileFields(req);
            if (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.photoProfile)
                photoProfile = uploadedImages.photoProfile;
            if (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.coverPicture)
                coverPicture = uploadedImages.coverPicture;
            const createdUser = yield userService_1.default.create({
                email,
                firstName,
                password,
                bio,
                username,
                lastName,
                coverPicture,
                photoProfile,
            });
            return res
                .status(201)
                .json(new response_1.Created(createdUser, "User successfully saved."));
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, getParamsId_1.getParamsId)(req);
            yield userService_1.default.delete(userId);
            return res.status(204).json(new response_1.NoContent("User successfully deleted."));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bio, firstName, lastName, username } = req.body;
            let { photoProfile, coverPicture } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadFileFields(req);
            if (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.photoProfile)
                photoProfile = uploadedImages.photoProfile;
            if (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.coverPicture)
                coverPicture = uploadedImages.coverPicture;
            const userId = (0, getParamsId_1.getParamsId)(req);
            yield userService_1.default.update(userId, {
                bio,
                firstName,
                lastName,
                coverPicture,
                photoProfile,
                username,
            });
            return res.status(204).json(new response_1.NoContent("User successfully updated."));
        });
    }
    follow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const userId = (0, getParamsId_1.getParamsId)(req);
            const isFollowed = yield userService_1.default.follow(loggedUserId, userId);
            return res.json(new response_1.Success(null, isFollowed ? "User successfully followed." : "User already followed."));
        });
    }
    unfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const userId = (0, getParamsId_1.getParamsId)(req);
            const isUnfollowed = yield userService_1.default.unfollow(loggedUserId, userId);
            return res.json(new response_1.Success(null, isUnfollowed ? "User successfully unfollowed." : "User not followed."));
        });
    }
    followers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, getParamsId_1.getParamsId)(req);
            const currentUserId = req.userId;
            yield userService_1.default.find(userId);
            const paginationOptions = req.pagination;
            const [users, count] = yield userService_1.default.findFollowings(userId, currentUserId, "followers", paginationOptions);
            return res.json(new response_1.ApiPagingResponse(req, users, count));
        });
    }
    following(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, getParamsId_1.getParamsId)(req);
            const currentUserId = req.userId;
            yield userService_1.default.find(userId);
            const paginationOptions = req.pagination;
            const [users, count] = yield userService_1.default.findFollowings(userId, currentUserId, "following", paginationOptions);
            return res.json(new response_1.ApiPagingResponse(req, users, count));
        });
    }
    findByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const paginationOptions = req.pagination;
            const userId = (0, getParamsId_1.getParamsId)(req);
            const [threads, count] = yield threadService_1.default.findByUserId(userId, paginationOptions, req.userId);
            return res.json(new response_1.ApiPagingResponse(req, threads, count));
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, httpMethod_1.Get)("/"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "index", null);
__decorate([
    (0, httpMethod_1.Get)("/suggestion"),
    (0, authorize_1.Authorize)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "suggestion", null);
__decorate([
    (0, httpMethod_1.Get)("/:id"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "show", null);
__decorate([
    (0, httpMethod_1.Post)("/"),
    (0, authorize_1.Authorize)(),
    (0, authorize_1.AdminOnly)(),
    (0, uploadImage_1.UploadImage)("fields", [
        { name: "photoProfile", maxCount: 1 },
        { name: "coverPicture", maxCount: 1 },
    ]),
    (0, validate_1.Validate)({ body: user_1.createUserSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "store", null);
__decorate([
    (0, httpMethod_1.Delete)("/:id"),
    (0, authorize_1.Authorize)(),
    (0, authorize_1.AdminOnly)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "destroy", null);
__decorate([
    (0, httpMethod_1.Patch)("/:id"),
    (0, authorize_1.Authorize)(),
    (0, authorize_1.AdminOnly)(),
    (0, uploadImage_1.UploadImage)("fields", [
        { name: "photoProfile", maxCount: 1 },
        { name: "coverPicture", maxCount: 1 },
    ]),
    (0, validate_1.Validate)({ body: user_1.updateUserSchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, httpMethod_1.Post)("/:id/follow"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "follow", null);
__decorate([
    (0, httpMethod_1.Delete)("/:id/follow"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unfollow", null);
__decorate([
    (0, httpMethod_1.Get)("/:id/followers"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followers", null);
__decorate([
    (0, httpMethod_1.Get)("/:id/following"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "following", null);
__decorate([
    (0, httpMethod_1.Get)("/:id/threads"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findByUserId", null);
exports.UserController = UserController = __decorate([
    (0, controller_1.Controller)("/users")
], UserController);
//# sourceMappingURL=userController.js.map