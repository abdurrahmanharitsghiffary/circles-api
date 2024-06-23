"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.ReplyOwnerOnly = exports.ThreadOwnerOnly = exports.OwnerOnly = exports.AdminOnly = exports.Authorize = void 0;
const authService_1 = require("@/services/authService");
const error_1 = require("@/libs/error");
const getParamsId_1 = require("@/utils/getParamsId");
const consts_1 = require("@/libs/consts");
const Model = __importStar(require("@/models"));
const upperFirstCase_1 = require("@/utils/upperFirstCase");
const middleware_1 = require("./middleware");
function Authorize({ isOptional } = { isOptional: false }) {
    return (0, middleware_1.Middleware)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        yield authService_1.AuthService.verifyAuth(req, next, isOptional);
    }));
}
exports.Authorize = Authorize;
function AdminOnly() {
    return (0, middleware_1.Middleware)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (((_b = (_a = req === null || req === void 0 ? void 0 : req.auth) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN")
            throw new error_1.UnauthorizedError("Only ADMIN can access this endpoint.");
        return next();
    }));
}
exports.AdminOnly = AdminOnly;
function OwnerOnly(prismaPromise, ownerIdKey, resourceKey, paramsKey = "id") {
    return (0, middleware_1.Middleware)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const id = (0, getParamsId_1.getParamsId)(req, paramsKey);
        const awaited = yield prismaPromise(id);
        if (!awaited)
            throw new error_1.NotFoundError(consts_1.ERROR_MESSAGE.notFound((0, upperFirstCase_1.upperFirstCase)(resourceKey)));
        if (((_b = (_a = req === null || req === void 0 ? void 0 : req.auth) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id) !== awaited[ownerIdKey])
            throw new error_1.UnauthorizedError(consts_1.ERROR_MESSAGE.unauthoredModify(resourceKey));
        return next();
    }));
}
exports.OwnerOnly = OwnerOnly;
const ThreadOwnerOnly = () => OwnerOnly((id) => Model.Thread.findFirst({ where: { id } }), "authorId", "thread");
exports.ThreadOwnerOnly = ThreadOwnerOnly;
const ReplyOwnerOnly = () => OwnerOnly((id) => Model.Reply.findUnique({ where: { id } }), "authorId", "reply");
exports.ReplyOwnerOnly = ReplyOwnerOnly;
//# sourceMappingURL=authorize.js.map