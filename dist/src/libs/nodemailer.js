"use strict";
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
exports.sendSuccessfulChangePassword = exports.sendSuccessfulResetPassword = exports.sendSuccessfulVerifyAccount = exports.sendVerifyEmailLink = exports.sendResetPasswordLink = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const env_1 = require("@/config/env");
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    service: env_1.TP.SERVICE,
    auth: {
        user: env_1.TP.USER,
        pass: env_1.TP.PASS,
    },
});
const baseMailOptions = {
    from: "Circle App <circleapp95@gmail.com>",
};
const sendEmail = (emailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield transporter.sendMail(Object.assign({}, emailOptions));
        logger_1.logger.info(response.response, "RESP");
        return response;
    }
    catch (err) {
        logger_1.logger.error(err);
        return err;
    }
});
exports.sendEmail = sendEmail;
const sendResetPasswordLink = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fullName, to, url, }) {
    yield (0, exports.sendEmail)(Object.assign(Object.assign({}, baseMailOptions), { to, text: `Click here to reset your password ${url}`, subject: "Reset Password", html: resetPasswordHtml({ link: url, fullName: fullName }) }));
});
exports.sendResetPasswordLink = sendResetPasswordLink;
const sendVerifyEmailLink = (to, url) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(Object.assign(Object.assign({}, baseMailOptions), { text: `Click here to verify your account ${url}`, subject: "Verify Account", to }));
});
exports.sendVerifyEmailLink = sendVerifyEmailLink;
const sendSuccessfulVerifyAccount = (to) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(Object.assign(Object.assign({}, baseMailOptions), { subject: "Verify Account", to, text: "You have successfully verify your account." }));
});
exports.sendSuccessfulVerifyAccount = sendSuccessfulVerifyAccount;
const sendSuccessfulResetPassword = (to) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(Object.assign(Object.assign({}, baseMailOptions), { subject: "Reset Password", to, text: "You have successfully reset your password." }));
});
exports.sendSuccessfulResetPassword = sendSuccessfulResetPassword;
const sendSuccessfulChangePassword = (to) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(Object.assign(Object.assign({}, baseMailOptions), { subject: "Change Password", to, text: "You have successfully changed your password. If you didn't change your password but you receive this email, you can submit request to reset your password." }));
});
exports.sendSuccessfulChangePassword = sendSuccessfulChangePassword;
const resetPasswordHtml = ({ fullName, link, }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="600" cellpadding="20" cellspacing="0" style="border: 1px solid #dddddd;">
                    <tr>
                        <td>
                            <p>Dear ${fullName},</p>
                            <p>We have successfully reset your account password as per your request.</p>
                            <p>To complete the process, please click the button below to create a new password:</p>
                            <p style="text-align: center;">
                                <a href="${link}" style="background-color: #2F855A; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                            </p>
                            <p>For your security, this link will expire in [5 minutes, e.g., 24 hours]. If you did not request a password reset, you can ignore this email, only a person with access to this email can reset your account password.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
//# sourceMappingURL=nodemailer.js.map