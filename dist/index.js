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
require("module-alias/register");
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./src/libs/logger");
const http_1 = require("http");
const env_1 = require("@/config/env");
const server = (0, http_1.createServer)(app_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server.listen(env_1.ENV.PORT, () => {
                logger_1.logger.info(`Running on ${env_1.NODE_ENV} environment.`);
                logger_1.logger.info(`Listening on http://localhost:${env_1.ENV.PORT}`);
            });
        }
        catch (err) {
            logger_1.logger.error(err);
        }
    });
}
main();
//# sourceMappingURL=index.js.map