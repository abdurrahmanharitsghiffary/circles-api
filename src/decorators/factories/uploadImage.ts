import { uploadImage, uploadImageExtended } from "@/middlewares/multer";
import { MiddlewareDecorator } from "..";

export function UploadImage<T extends keyof typeof uploadImage>(
  key: T,
  ...value: Parameters<(typeof uploadImage)[T]>
) {
  return MiddlewareDecorator(uploadImageExtended(key, ...value));
}
