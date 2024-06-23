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
exports.redisClient = void 0;
const env_1 = require("@/config/env");
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.ENV.REDIS_URL,
    password: env_1.ENV.REDIS_PASS,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.redisClient.connect();
}))();
exports.redisClient.on("error", (err) => {
    console.error("REDIS ERROR: ", err);
});
exports.redisClient.on("connect", () => {
    console.log("Redis connected.");
});
//# sourceMappingURL=redisClient.js.map