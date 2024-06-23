"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const getEnv = (key) => { var _a; return (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a[key]; };
exports.getEnv = getEnv;
//# sourceMappingURL=env.js.map