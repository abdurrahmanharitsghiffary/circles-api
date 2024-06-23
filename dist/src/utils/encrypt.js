"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("@/config/env");
const algorithm = "aes-256-cbc";
const key = env_1.ENV.ENCRYPTION_KEY;
const iv = env_1.ENV.IV;
const encrypt = (text) => new Promise((resolve) => {
    const cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(key), Buffer.from(iv));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return resolve(encrypted.toString("hex"));
});
exports.encrypt = encrypt;
const decrypt = (text) => new Promise((resolve) => {
    const encryptedText = Buffer.from(text, "hex");
    const decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return resolve(decrypted.toString());
});
exports.decrypt = decrypt;
//# sourceMappingURL=encrypt.js.map