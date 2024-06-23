"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataURIFromBuffer = void 0;
const getDataURIFromBuffer = (file) => {
    return new Promise((resolve) => {
        if (!(file === null || file === void 0 ? void 0 : file.buffer))
            return resolve(null);
        const b64 = Buffer.from(file === null || file === void 0 ? void 0 : file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        return resolve(dataURI);
    });
};
exports.getDataURIFromBuffer = getDataURIFromBuffer;
//# sourceMappingURL=getDataURIFromBuffer.js.map