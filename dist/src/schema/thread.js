"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateThreadSchema = exports.createThreadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
exports.createThreadSchema = joi_1.default.object({
    content: _1.J.text.required(),
    images: _1.J.photos,
});
exports.updateThreadSchema = joi_1.default.object({
    content: _1.J.text,
    images: _1.J.photos,
});
//# sourceMappingURL=thread.js.map