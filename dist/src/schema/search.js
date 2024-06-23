"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const paging_1 = require("./paging");
exports.searchQuerySchema = paging_1.pagingSchema.keys({
    q: joi_1.default.string().min(0),
    type: joi_1.default.string()
        .pattern(/^(all|((threads|users)(,(threads|users))*))$/)
        .messages({
        "string.pattern.base": `Value must be "all" or "threads", and "users" value except "all" can be a combination separated by commas, without duplicates or spaces. example accepted value: "all" | "threads,users" | "users"`,
    })
        .optional(),
});
//# sourceMappingURL=search.js.map