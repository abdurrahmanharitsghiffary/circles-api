"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepgram = void 0;
const env_1 = require("@/utils/env");
const sdk_1 = require("@deepgram/sdk");
exports.deepgram = (0, sdk_1.createClient)((0, env_1.getEnv)("DEEPGRAM_API_KEY"));
//# sourceMappingURL=deepgram.js.map