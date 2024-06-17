import { uploadImage, uploadImageExtended } from "@/middlewares/multer";
import { Middleware } from "./middleware";

export function UploadImage<T extends keyof typeof uploadImage>(
  key: T,
  ...value: Parameters<(typeof uploadImage)[T]>
) {
  return Middleware(uploadImageExtended(key, ...value));
}
