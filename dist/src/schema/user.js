"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.updateUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
exports.updateUserSchema = joi_1.default.object({
    firstName: _1.J.firstName,
    username: _1.J.username,
    lastName: _1.J.lastName,
    bio: _1.J.bio,
    photoProfile: _1.J.photo,
    coverPicture: _1.J.photo,
});
exports.createUserSchema = joi_1.default.object({
    firstName: _1.J.firstName.required(),
    username: _1.J.username.required(),
    coverPicture: _1.J.photo,
    lastName: _1.J.lastName,
    bio: _1.J.bio,
    photoProfile: _1.J.photo,
    email: _1.J.email.required(),
    password: _1.J.password.required(),
});
//# sourceMappingURL=user.js.map