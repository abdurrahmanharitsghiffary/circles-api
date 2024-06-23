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
exports.LikeController = void 0;
const response_1 = require("@/libs/response");
const likeService_1 = require("@/services/likeService");
const getParamsId_1 = require("@/utils/getParamsId");
const authorize_1 = require("@/decorators/factories/authorize");
const validate_1 = require("@/decorators/factories/validate");
const paging_1 = require("@/schema/paging");
const schema_1 = require("@/schema");
const threadService_1 = __importDefault(require("@/services/threadService"));
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
let LikeController = class LikeController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (0, getParamsId_1.getParamsId)(req);
            yield threadService_1.default.find(threadId);
            const paginationOptions = req.pagination;
            const [users, count] = yield likeService_1.LikeService.findAll(threadId, paginationOptions, req.userId);
            return res.json(new response_1.ApiPagingResponse(req, users, count));
        });
    }
    unlike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const threadId = (0, getParamsId_1.getParamsId)(req);
            yield threadService_1.default.find(threadId);
            const isDeleted = yield likeService_1.LikeService.delete(loggedUserId, threadId);
            return res.json(new response_1.Success(null, isDeleted ? "Thread unliked successfully." : "Thread not liked."));
        });
    }
    like(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUserId = req.userId;
            const threadId = (0, getParamsId_1.getParamsId)(req);
            yield threadService_1.default.find(threadId);
            const isStored = yield likeService_1.LikeService.create(loggedUserId, threadId);
            return res.json(new response_1.Success(null, isStored ? "Thread successfully liked." : "Thread already liked."));
        });
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, httpMethod_1.Get)("/:id/likes"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.Validate)({ query: paging_1.pagingSchema, params: schema_1.paramsSchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "index", null);
__decorate([
    (0, httpMethod_1.Delete)("/:id/likes"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "unlike", null);
__decorate([
    (0, httpMethod_1.Post)("/:id/likes"),
    (0, authorize_1.Authorize)(),
    (0, validate_1.ValidateParamsAsNumber)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "like", null);
exports.LikeController = LikeController = __decorate([
    (0, controller_1.Controller)("/threads")
], LikeController);
//# sourceMappingURL=likeController.js.map