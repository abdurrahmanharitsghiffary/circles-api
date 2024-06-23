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
exports.cloudinaryUpload = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
exports.cloudinary = cloudinary_1.v2;
exports.cloudinary.config({ secure: true });
const cloudinaryUpload = (dataURI) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.cloudinary.uploader.upload(dataURI, {
        upload_preset: "image_preset_v1",
    });
});
exports.cloudinaryUpload = cloudinaryUpload;
//# sourceMappingURL=cloudinary.js.map