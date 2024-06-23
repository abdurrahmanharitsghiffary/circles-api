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
exports.SearchController = void 0;
const userService_1 = __importDefault(require("@/services/userService"));
const validate_1 = require("@/decorators/factories/validate");
const authorize_1 = require("@/decorators/factories/authorize");
const threadService_1 = __importDefault(require("@/services/threadService"));
const pagination_1 = require("@/libs/pagination");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
const search_1 = require("@/schema/search");
let SearchController = class SearchController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q = "", type = "all" } = req.query;
            const t = type.toString().split(",");
            const paginationOptions = req.pagination;
            const userId = req.userId;
            const data = {};
            if (t.includes("all") || t.includes("users")) {
                const [users, userCount] = yield userService_1.default.search(q.toString(), paginationOptions, userId);
                const userPaging = new pagination_1.Pagination(req, users, userCount);
                data.users = {
                    items: users,
                    meta: userPaging,
                };
            }
            if (t.includes("all") || t.includes("threads")) {
                const [threads, threadCount] = yield threadService_1.default.search(q.toString(), paginationOptions, userId);
                const threadPaging = new pagination_1.Pagination(req, threads, threadCount);
                data.threads = {
                    items: threads,
                    meta: threadPaging,
                };
            }
            const resJson = { data, status: 200, success: true };
            return res.json(resJson);
        });
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, httpMethod_1.Get)("/"),
    (0, authorize_1.Authorize)({ isOptional: true }),
    (0, validate_1.Validate)({ query: search_1.searchQuerySchema }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "handle", null);
exports.SearchController = SearchController = __decorate([
    (0, controller_1.Controller)("/search")
], SearchController);
//# sourceMappingURL=searchController.js.map