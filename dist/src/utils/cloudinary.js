"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cloudinary = void 0;
const cloudinary_1 = require("@/libs/cloudinary");
class Cloudinary {
    static uploadMultipleFiles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = [];
            if ((req === null || req === void 0 ? void 0 : req.files) && req.files instanceof Array) {
                for (const file of req.files) {
                    if (!file)
                        continue;
                    const uploadedImage = yield (0, cloudinary_1.cloudinaryUpload)(file.dataURI);
                    images.push(uploadedImage.secure_url);
                }
            }
            return images;
        });
    }
    static uploadSingleFile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let image;
            if ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.dataURI) {
                const uploadedImage = yield (0, cloudinary_1.cloudinaryUpload)(req.file.dataURI);
                image = uploadedImage.secure_url;
            }
            return image;
        });
    }
    static uploadFileFields(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = {};
            if (req.files instanceof Array === false) {
                for (const [key, files] of Object.entries(req.files)) {
                    if (!files || files.length < 1)
                        continue;
                    const dataURI = files[0].dataURI;
                    const uploadedImage = yield (0, cloudinary_1.cloudinaryUpload)(dataURI);
                    images[key] = uploadedImage.secure_url;
                }
            }
            return images;
        });
    }
}
exports.Cloudinary = Cloudinary;
//# sourceMappingURL=cloudinary.js.map