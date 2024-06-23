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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyLikeController = void 0;
const authorize_1 = require("@/decorators/factories/authorize");
const validate_1 = require("@/decorators/factories/validate");
const response_1 = require("@/libs/response");
const schema_1 = require("@/schema");
const paging_1 = require("@/schema/paging");
const getParamsId_1 = require("@/utils/getParamsId");
const replyLikeService_1 = require("@/services/replyLikeService");
const replyService_1 = require("@/services/replyService");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
let ReplyLikeController = class ReplyLikeController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyId = (0, getParamsId_1.getParamsId)(req);
            yield replyService_1.ReplyService.find(replyId);
            const paginationOptions = req.pagination;
            const [users, count] = yield replyLikeService_1.ReplyLikeService.findAll(replyId, paginationOptions, req.userId);
            return res.json(new response_1.ApiPagingResponse(req, users, count));
        });
    }
    unlike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const replyId = (0, getParamsId_1.getParamsId)(req);
            yield replyService_1.ReplyService.find(replyId);
            const isDeleted = yield replyLikeService_1.ReplyLikeService.delete(loggedUserId, replyId);
            return res.json(new response_1.Success(null, isDeleted ? "Reply unliked successfully." : "Reply not liked."));
        });
    }
    like(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const replyId = (0, getParamsId_1.getParamsId)(req);
            yield replyService_1.ReplyService.find(replyId);
            const isStored = yield replyLikeService_1.ReplyLikeService.create(loggedUserId, replyId);
            return res.json(new response_1.Success(null, isStored ? "Reply successfully liked." : "Reply already liked."));
        });
    }
};
exports.ReplyLikeController = ReplyLikeController;
__decorate([
    (0, httpMethod_1.Get)("/:id/likes"),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    (0, authorize_1.Authorize)({ isOptional: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyLikeController.prototype, "index", null);
__decorate([
    (0, httpMethod_1.Delete)("/:id/likes"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyLikeController.prototype, "unlike", null);
__decorate([
    (0, httpMethod_1.Post)("/:id/likes"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReplyLikeController.prototype, "like", null);
exports.ReplyLikeController = ReplyLikeController = __decorate([
    (0, controller_1.Controller)("/reply")
], ReplyLikeController);
//# sourceMappingURL=replyLikeController.js.map