import { AppRequest, AppResponse } from "@/types/express";
import { NextFunction } from "express";
import multer from "multer";
import { getDataURIFromBuffer } from "@/utils/getDataURIFromBuffer";

const alloweMimeTypes = [
  "image/png",
  "image/jpg",
  "image/webp",
  "image/jpeg",
  "image/gif",
];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3000000 },
  fileFilter(req, file, callback) {
    callback(null, alloweMimeTypes.includes(file.mimetype));
  },
});

export const uploadImagePromise = <T extends keyof typeof uploadImage>(
  key: T,
  ...value: Parameters<(typeof uploadImage)[T]>
) => {
  return (req: AppRequest, res: AppResponse) =>
    new Promise<void>((resolve, reject) => {
      // @ts-expect-error Gak Bakal Error
      uploadImage[key](...value)(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
};

const extendsMulterFile = async (file: Express.Multer.File) => ({
  ...file,
  dataURI: await getDataURIFromBuffer(file),
});

export const uploadImageExtended =
  <T extends keyof typeof uploadImage>(
    key: T,
    ...value: Parameters<(typeof uploadImage)[T]>
  ) =>
  async (req: AppRequest, res: AppResponse, next: NextFunction) => {
    await uploadImagePromise(key, ...value)(req, res);

    if (key === "single") {
      req.file = await extendsMulterFile(req.file);
    } else if (key === "array") {
      if (req.files instanceof Array) {
        const files = await Promise.all(
          req.files.map(async (file) => await extendsMulterFile(file))
        );
        req.files = files;
      }
    } else if (key === "fields") {
      if (req.files instanceof Array === false) {
        for (const [key, files] of Object.entries(req.files)) {
          if (req.files instanceof Array === false && files instanceof Array) {
            req.files[key as string] = await Promise.all(
              files.map(async (file) => await extendsMulterFile(file))
            );
          }
        }
      }
    }

    return next();
  };
