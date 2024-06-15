import { AppRequest } from "@/types/express";
import uap from "ua-parser-js";

export const uaParser = (req: AppRequest) => uap(req?.headers?.["user-agent"]);
