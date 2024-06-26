import { cloudinaryUpload } from "@/libs/cloudinary";
import { AppRequest } from "@/types/express";

export class Cloudinary {
  static async uploadMultipleFiles(req: AppRequest) {
    const images: string[] = [];
    if (req?.files && req.files instanceof Array) {
      for (const file of req.files) {
        if (!file) continue;
        const uploadedImage = await cloudinaryUpload(file.dataURI);
        images.push(uploadedImage.secure_url);
      }
    }

    return images;
  }

  static async uploadSingleFile(req: AppRequest) {
    let image: string;
    if (req?.file?.dataURI) {
      const uploadedImage = await cloudinaryUpload(req.file.dataURI);
      image = uploadedImage.secure_url;
    }

    return image;
  }

  static async uploadFileFields(req: AppRequest) {
    const images: { [keyof: string]: string } = {};
    if (req.files instanceof Array === false) {
      for (const [key, files] of Object.entries(req.files)) {
        if (!files || files.length < 1) continue;
        const dataURI = files[0].dataURI;
        const uploadedImage = await cloudinaryUpload(dataURI);
        images[key] = uploadedImage.secure_url;
      }
    }
    return images;
  }
}
