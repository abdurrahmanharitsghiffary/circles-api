"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePaswordSchema = exports.resetPasswordSchema = exports.signUpSchema = exports.signInSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
exports.signInSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.ref("password"),
    email: _1.J.email.required(),
})
    .with("password", "confirmPassword")
    .messages({ "any.only": `"confirmPassword" and "password" must be equals` });
exports.signUpSchema = exports.signInSchema.keys({
    firstName: _1.J.firstName.required(),
    lastName: _1.J.lastName,
    username: _1.J.username.required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    newPassword: _1.J.password.required(),
    confirmPassword: joi_1.default.ref("newPassword"),
})
    .with("newPassword", "confirmPassword")
    .messages({
    "any.only": `"confirmPassword" and "newPassword" must be equals`,
});
exports.changePaswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().min(1).required(),
    newPassword: _1.J.password.required(),
    confirmPassword: joi_1.default.ref("newPassword"),
})
    .with("password", "confirmPassword")
    .messages({
    "any.only": `"confirmPassword" and "newPassword" must be equals`,
});
//# sourceMappingURL=auth.js.map