"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagingOptions = void 0;
const getPagingOptions = (req) => {
    const { limit = 20, offset = 0 } = req.query;
    return {
        limit: Number(limit),
        offset: Number(offset),
    };
};
exports.getPagingOptions = getPagingOptions;
//# sourceMappingURL=getPagingOptions.js.map