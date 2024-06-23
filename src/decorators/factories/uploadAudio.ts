import { uploadAudio, uploadAudioExtended } from "@/middlewares/multer";
import { Middleware } from "./middleware";

export const UploadAudio = <T extends keyof typeof uploadAudio>(
  key: T,
  ...value: Parameters<(typeof uploadAudio)[T]>
) => {
  return Middleware(uploadAudioExtended(key, ...value));
};
