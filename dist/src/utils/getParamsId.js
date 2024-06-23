"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamsId = void 0;
const getParamsId = (req, key = "id") => { var _a; return Number((_a = req.params) === null || _a === void 0 ? void 0 : _a[key]) || -1; };
exports.getParamsId = getParamsId;
//# sourceMappingURL=getParamsId.js.map