"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadImage = UploadImage;
const multer_1 = require("@/middlewares/multer");
const middleware_1 = require("./middleware");
function UploadImage(key, ...value) {
    return (0, middleware_1.Middleware)((0, multer_1.uploadImageExtended)(key, ...value));
}
//# sourceMappingURL=uploadImage.js.map