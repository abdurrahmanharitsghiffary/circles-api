import crypto from "crypto";

export const genRandToken = async () => {
  return new Promise<string>((resolve) => {
    resolve(crypto.randomBytes(32).toString("hex"));
  });
};
