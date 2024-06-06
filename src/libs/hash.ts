import bcrypt from "bcrypt";
import { getEnv } from "@/utils/env";

export const hash = async (data: string | Buffer) => {
  return await bcrypt.hash(data, Number(getEnv("SALT")));
};
