import { v2 } from "cloudinary";

export const cloudinary = v2;

cloudinary.config({ secure: true });

export const cloudinaryUpload = async (dataURI?: string) => {
  return await cloudinary.uploader.upload(dataURI, {
    upload_preset: "image_preset_v1",
  });
};
