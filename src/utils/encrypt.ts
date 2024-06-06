import crypto from "crypto";
import { getEnv } from "./env";

const algorithm = "aes-256-cbc";
const key = getEnv("ENCRYPTION_KEY");
const iv = getEnv("IV");

export const encrypt = (text: string) =>
  new Promise<string>((resolve, reject) => {
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(key),
      Buffer.from(iv)
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return resolve(encrypted.toString("hex"));
  });

export const decrypt = (text: string) =>
  new Promise<string>((resolve, reject) => {
    const encryptedText = Buffer.from(text, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key),
      Buffer.from(iv)
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return resolve(decrypted.toString());
  });
