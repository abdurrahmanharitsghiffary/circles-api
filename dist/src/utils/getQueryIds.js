"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryIds = void 0;
const getQueryIds = (req, key = "id") => {
    var _a, _b;
    const queryId = ((_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : "").split(",");
    const ids = queryId.map((id) => Number(id.trim()) || -1);
    return ids;
};
exports.getQueryIds = getQueryIds;
//# sourceMappingURL=getQueryIds.js.map