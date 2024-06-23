"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadAudio = void 0;
const multer_1 = require("@/middlewares/multer");
const middleware_1 = require("./middleware");
const UploadAudio = (key, ...value) => {
    return (0, middleware_1.Middleware)((0, multer_1.uploadAudioExtended)(key, ...value));
};
exports.UploadAudio = UploadAudio;
//# sourceMappingURL=uploadAudio.js.map