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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAudioExtended = exports.uploadImageExtended = exports.uploaderExtended = exports.uploaderPromise = exports.uploadAudio = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const getDataURIFromBuffer_1 = require("@/utils/getDataURIFromBuffer");
const alloweMimeTypes = [
    "image/png",
    "image/jpg",
    "image/webp",
    "image/jpeg",
    "image/gif",
];
exports.uploadImage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 3000000 },
    fileFilter(req, file, callback) {
        callback(null, alloweMimeTypes.includes(file.mimetype));
    },
});
exports.uploadAudio = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fieldSize: 1000000 },
    fileFilter(req, file, callback) {
        callback(null, ["audio/mpeg", "audio/ogg", "audio/webm", "audio/3gpp"].includes(file.mimetype));
    },
});
const uploaderPromise = (uploader, key, ...value) => {
    return (req, res) => new Promise((resolve, reject) => {
        // @ts-expect-error Gak Bakal Error
        uploader[key](...value)(req, res, (err) => {
            if (err)
                reject(err);
            resolve();
        });
    });
};
exports.uploaderPromise = uploaderPromise;
const extendsMulterFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return (Object.assign(Object.assign({}, file), { dataURI: yield (0, getDataURIFromBuffer_1.getDataURIFromBuffer)(file) }));
});
const uploaderExtended = (uploader, key, ...value) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.uploaderPromise)(uploader, key, ...value)(req, res);
    if (key === "single") {
        req.file = yield extendsMulterFile(req.file);
    }
    else if (key === "array") {
        if (req.files instanceof Array) {
            const files = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield extendsMulterFile(file); })));
            req.files = files;
        }
    }
    else if (key === "fields") {
        if (req.files instanceof Array === false) {
            for (const [key, files] of Object.entries(req.files)) {
                if (req.files instanceof Array === false && files instanceof Array) {
                    req.files[key] = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield extendsMulterFile(file); })));
                }
            }
        }
    }
    return next();
});
exports.uploaderExtended = uploaderExtended;
const uploadImageExtended = (key, ...value) => {
    return (0, exports.uploaderExtended)(exports.uploadImage, key, ...value);
};
exports.uploadImageExtended = uploadImageExtended;
const uploadAudioExtended = (key, ...value) => {
    return (0, exports.uploaderExtended)(exports.uploadAudio, key, ...value);
};
exports.uploadAudioExtended = uploadAudioExtended;
//# sourceMappingURL=multer.js.map