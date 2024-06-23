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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const prismaClient_1 = require("@/libs/prismaClient");
const models_1 = require("@/models");
class RefreshTokenService {
    static findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { userId };
            const [tokens, count] = yield prismaClient_1.prisma.$transaction([
                models_1.RefreshToken.findMany({ where }),
                models_1.RefreshToken.count({ where }),
            ]);
            return [tokens, count];
        });
    }
    static find(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.RefreshToken.findUnique({ where: { token } });
        });
    }
    static create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ token, userId, expiresAt }) {
            return yield models_1.RefreshToken.create({
                data: {
                    token,
                    userId,
                    expiresAt: expiresAt !== null && expiresAt !== void 0 ? expiresAt : 1000 * 60 * 60 * 24 * 7,
                },
            });
        });
    }
    static delete(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.find(token);
            if (!refreshToken)
                return false;
            yield models_1.RefreshToken.delete({ where: { token } });
            return true;
        });
    }
}
exports.RefreshTokenService = RefreshTokenService;
//# sourceMappingURL=refreshTokenService.js.map