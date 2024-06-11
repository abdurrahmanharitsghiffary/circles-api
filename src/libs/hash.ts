import bcrypt from "bcrypt";
import { ENV } from "@/config/env";

export const hash = async (data: string | Buffer) => {
  return await bcrypt.hash(data, ENV.SALT);
};
