"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitProperties = omitProperties;
function omitProperties(obj, keys) {
    const result = {};
    Object.keys(obj).forEach((key) => {
        if (!keys.includes(key)) {
            // @ts-expect-error this is correct dont bother
            result[key] = obj[key];
        }
    });
    return result;
}
//# sourceMappingURL=omitProperties.js.map