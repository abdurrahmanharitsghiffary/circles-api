"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignProps = void 0;
const assignProps = (obj, obj2) => {
    for (const [key, value] of Object.entries(obj2)) {
        // @ts-expect-error This is correct dont bother
        obj[key] = value;
    }
};
exports.assignProps = assignProps;
//# sourceMappingURL=assignProps.js.map