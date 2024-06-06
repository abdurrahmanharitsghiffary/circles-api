import { uploadImage, uploadImageExtended } from "@/middlewares/multer";
import { MethodDecorator } from "..";

export function UploadImage<T extends keyof typeof uploadImage>(
  key: T,
  ...value: Parameters<(typeof uploadImage)[T]>
) {
  return MethodDecorator(uploadImageExtended(key, ...value));
}
