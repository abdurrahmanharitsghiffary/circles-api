import { Request, Response } from "express";
import multer from "multer";
import { getDataURIFromBuffer } from "@/utils/getDataURIFromBuffer";

const alloweMimeTypes = ["image/png", "image/jpg", "image/webp", "image/jpeg"];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300000 },
  fileFilter(req, file, callback) {
    callback(null, alloweMimeTypes.includes(file.mimetype));
  },
});

export const uploadImagePromise = <T extends keyof typeof uploadImage>(
  key: T,
  ...value: Parameters<(typeof uploadImage)[T]>
) => {
  return (req: Request, res: Response) =>
    new Promise<void>((resolve, reject) => {
      // @ts-expect-error
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
  async (req: Request, res: Response) => {
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
  };
