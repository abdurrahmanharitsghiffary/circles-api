import dotenv from "dotenv";
dotenv.config();
export const getEnv = (key: string) => process?.env?.[key];
