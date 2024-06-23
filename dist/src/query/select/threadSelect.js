"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadSelectWithFilterCount = exports.threadSelect = void 0;
const userSelect_1 = require("./userSelect");
exports.threadSelect = {
    author: { select: userSelect_1.userBaseSelect },
    content: true,
    createdAt: true,
    id: true,
    images: true,
    updatedAt: true,
    _count: { select: { likes: true, replies: true } },
};
const threadSelectWithFilterCount = (userId) => (Object.assign(Object.assign({}, exports.threadSelect), { likes: {
        where: { userId: userId || -1 },
        select: { userId: true },
        take: 1,
    } }));
exports.threadSelectWithFilterCount = threadSelectWithFilterCount;
//# sourceMappingURL=threadSelect.js.map