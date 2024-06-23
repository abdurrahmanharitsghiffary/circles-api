"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReplySchema = exports.createReplySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
exports.createReplySchema = joi_1.default.object({
    content: _1.J.text.required(),
    image: _1.J.photo,
});
exports.updateReplySchema = joi_1.default.object({
    content: _1.J.text,
    image: _1.J.photo,
});
//# sourceMappingURL=reply.js.map