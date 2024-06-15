export const getDataURIFromBuffer = (file: Express.Multer.File) => {
  return new Promise<string | null>((resolve) => {
    if (!file?.buffer) return resolve(null);
    const b64 = Buffer.from(file?.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    return resolve(dataURI);
  });
};
