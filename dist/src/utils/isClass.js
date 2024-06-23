"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClass = void 0;
const isClass = (cls) => {
    var _a;
    return (_a = cls === null || cls === void 0 ? void 0 : cls.toString()) === null || _a === void 0 ? void 0 : _a.includes("class");
};
exports.isClass = isClass;
//# sourceMappingURL=isClass.js.map