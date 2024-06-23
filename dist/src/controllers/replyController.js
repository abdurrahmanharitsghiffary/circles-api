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
exports.ReplyController = void 0;
const replyService_1 = require("@/services/replyService");
const getParamsId_1 = require("@/utils/getParamsId");
const threadService_1 = __importDefault(require("@/services/threadService"));
const response_1 = require("../libs/response");
const validate_1 = require("../decorators/factories/validate");
const paging_1 = require("../schema/paging");
const schema_1 = require("../schema");
const authorize_1 = require("../decorators/factories/authorize");
const reply_1 = require("../schema/reply");
const uploadImage_1 = require("../decorators/factories/uploadImage");
const cloudinary_1 = require("@/utils/cloudinary");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
let ReplyController = class ReplyController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (0, getParamsId_1.getParamsId)(req);
            const { limit, offset } = req.pagination;
            yield threadService_1.default.find(threadId);
            const [replies, count] = yield replyService_1.ReplyService.findAll(threadId, {
                limit,
                offset,
            }, req.userId);
            return res.json(new response_1.ApiPagingResponse(req, replies, count));
        });
    }
    replies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyId = (0, getParamsId_1.getParamsId)(req);
            const { limit, offset } = req.pagination;
            yield replyService_1.ReplyService.find(replyId);
            const [replies, count] = yield replyService_1.ReplyService.findAllByParent(replyId, {
                limit,
                offset,
            }, req.userId);
            return res.json(new response_1.ApiPagingResponse(req, replies, count));
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyId = (0, getParamsId_1.getParamsId)(req);
            const reply = yield replyService_1.ReplyService.find(replyId, req.userId);
            return res.json(new response_1.Success(reply));
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (0, getParamsId_1.getParamsId)(req);
            const loggerUserId = req.userId;
            const { content, parentId } = req.body;
            let { image } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadSingleFile(req);
            if (uploadedImages)
                image = uploadedImages;
            const createdReply = yield replyService_1.ReplyService.create({
                authorId: loggerUserId,
                content,
                image,
                threadId,
                parentId: Number(parentId),
            });
            return res
                .status(201)
                .json(new response_1.Created(createdReply, "Successfully create reply."));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyId = (0, getParamsId_1.getParamsId)(req);
            const { content } = req.body;
            let { image } = req.body;
            const uploadedImages = yield cloudinary_1.Cloudinary.uploadSingleFile(req);
            if (uploadedImages)
                image = uploadedImages;
            yield replyService_1.ReplyService.update(replyId, { content, image });
            return res.status(204).json(new response_1.NoContent("Reply successfully updated."));
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyId = (0, getParamsId_1.getParamsId)(req);
            yield replyService_1.ReplyService.delete(replyId);
            return res.status(204).json(new response_1.NoContent("Reply successfully deleted."));
        });
    }
};
exports.ReplyController = ReplyController;
__decorate([
    (0, httpMethod_1.Get)("/threads/:id/replies"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    (0, authorize_1.Authorize)({ isOptional: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "index", null);
__decorate([
    (0, httpMethod_1.Get)("/reply/:id/replies"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    (0, authorize_1.Authorize)({ isOptional: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "replies", null);
__decorate([
    (0, httpMethod_1.Get)("/reply/:id"),
    (0, validate_1.ValidateParamsAsNumber)(),
    (0, authorize_1.Authorize)({ isOptional: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "show", null);
__decorate([
    (0, httpMethod_1.Post)("/threads/:id/replies"),
    (0, authorize_1.Authorize)(),
    (0, uploadImage_1.UploadImage)("single", "image"),
    (0, validate_1.Validate)({ body: reply_1.createReplySchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "store", null);
__decorate([
    (0, httpMethod_1.Patch)("/reply/:id"),
    (0, authorize_1.Authorize)(),
    (0, authorize_1.ReplyOwnerOnly)(),
    (0, uploadImage_1.UploadImage)("single", "image"),
    (0, validate_1.Validate)({ body: reply_1.updateReplySchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "update", null);
__decorate([
    (0, httpMethod_1.Delete)("/reply/:id"),
    (0, authorize_1.Authorize)(),
    (0, authorize_1.ReplyOwnerOnly)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "destroy", null);
exports.ReplyController = ReplyController = __decorate([
    (0, controller_1.Controller)("/")
], ReplyController);
//# sourceMappingURL=replyController.js.map