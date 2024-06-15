import crypto from "crypto";
import { ENV } from "@/config/env";

const algorithm = "aes-256-cbc";
const key = ENV.ENCRYPTION_KEY;
const iv = ENV.IV;

export const encrypt = (text: string) =>
  new Promise<string>((resolve) => {
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
  new Promise<string>((resolve) => {
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
