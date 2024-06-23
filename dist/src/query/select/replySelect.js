"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replySelectWithFilterCount = exports.replySelect = void 0;
const userSelect_1 = require("./userSelect");
exports.replySelect = {
    author: { select: userSelect_1.userBaseSelect },
    content: true,
    createdAt: true,
    id: true,
    image: true,
    parentId: true,
    threadId: true,
    updatedAt: true,
    _count: { select: { likes: true, replies: true } },
};
const replySelectWithFilterCount = (userId) => (Object.assign(Object.assign({}, exports.replySelect), { likes: {
        where: { userId: userId || -1 },
        select: { userId: true },
        take: 1,
    } }));
exports.replySelectWithFilterCount = replySelectWithFilterCount;
//# sourceMappingURL=replySelect.js.map