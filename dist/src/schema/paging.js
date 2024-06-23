"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagingSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
exports.pagingSchema = joi_1.default.object({
    limit: _1.J.int,
    offset: _1.J.int,
});
//# sourceMappingURL=paging.js.map