"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsSchema = exports.J = void 0;
const joi_1 = __importDefault(require("joi"));
exports.J = {
    id: joi_1.default.number().positive().integer().required(),
    int: joi_1.default.number().integer(),
    firstName: joi_1.default.string().min(1).max(150),
    lastName: joi_1.default.string().min(1).max(150),
    username: joi_1.default.string().min(2),
    password: joi_1.default.string().min(8).max(30),
    confirmPassword: joi_1.default.ref("password"),
    email: joi_1.default.string().email(),
    bio: joi_1.default.string(),
    photo: joi_1.default.string().uri(),
    photos: joi_1.default.array().items(joi_1.default.string().uri()),
    text: joi_1.default.string().min(1),
};
exports.paramsSchema = joi_1.default.object({ id: exports.J.id });
//# sourceMappingURL=index.js.map