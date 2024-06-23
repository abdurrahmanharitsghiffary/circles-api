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
exports.ThreadController = void 0;
require("reflect-metadata");
const response_1 = require("@/libs/response");
const getParamsId_1 = require("@/utils/getParamsId");
const threadService_1 = __importDefault(require("@/services/threadService"));
const validate_1 = require("@/decorators/factories/validate");
const thread_1 = require("@/schema/thread");
const uploadImage_1 = require("@/decorators/factories/uploadImage");
const authorize_1 = require("@/decorators/factories/authorize");
const paging_1 = require("@/schema/paging");
const schema_1 = require("@/schema");
const cloudinary_1 = require("@/utils/cloudinary");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
let ThreadController = class ThreadController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const paginationOptions = req.pagination;
            const userId = req.userId;
            const [threads, count] = yield threadService_1.default.findAll(paginationOptions, userId);
            return res.json(new response_1.ApiPagingResponse(req, threads, count));
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (0, getParamsId_1.getParamsId)(req);
            const userId = req.userId;
            const thread = yield threadService_1.default.find(threadId, userId);
            return res.json(new response_1.Success(thread));
        });
    }
    loler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json(new response_1.Success("hello"));
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = req.body;
            let { images } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadMultipleFiles(req);
            if (uploadedImages.length > 0)
                images = uploadedImages;
            const userId = req.userId;
            const createdThread = yield threadService_1.default.create({
                authorId: userId,
                content,
                images,
            });
            return res
                .status(201)
                .json(new response_1.Created(createdThread, "Thread successfully saved."));
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (0, getParamsId_1.getParamsId)(req);
            yield threadService_1.default.delete(threadId);
            return res.status(204).json(new response_1.NoContent("Thread successfully deleted."));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = req.body;
            let { images } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadMultipleFiles(req);
            if (uploadedImages.length > 0)
                images = uploadedImages;
            const threadId = (0, getParamsId_1.getParamsId)(req);
            yield threadService_1.default.update(threadId, { content, images });
            return res.status(204).json(new response_1.NoContent("Thread successfully updated."));
        });
    }
};
exports.ThreadController = ThreadController;
__decorate([
    (0, httpMethod_1.Get)("/"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreadController.prototype, "index", null);
__decorate([
    (0, httpMethod_1.Get)("/:id"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreadController.prototype, "show", null);
__decorate([
    (0, httpMethod_1.Get)("/lol"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreadController.prototype, "loler", null);
__decorate([
    (0, httpMethod_1.Post)("/"),
    (0, authorize_1.Authorize)(),
    (0, uploadImage_1.UploadImage)("array", "images[]"),
    (0, validate_1.Validate)({ body: thread_1.createThreadSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreadController.prototype, "store", null);
__decorate([
    (0, httpMethod_1.Delete)("/:id"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    (0, authorize_1.ThreadOwnerOnly)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreadController.prototype, "destroy", null);
__decorate([
    (0, httpMethod_1.Patch)("/:id"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.Validate)({ body: thread_1.updateThreadSchema, params: schema_1.paramsSchema }),
    (0, authorize_1.ThreadOwnerOnly)(),
    (0, uploadImage_1.UploadImage)("array", "images[]"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreadController.prototype, "update", null);
exports.ThreadController = ThreadController = __decorate([
    (0, controller_1.Controller)("/threads")
], ThreadController);
//# sourceMappingURL=threadController.js.map