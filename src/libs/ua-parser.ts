import { Request } from "express";
import uap from "ua-parser-js";

export const uaParser = (req: Request) => uap(req?.headers?.["user-agent"]);
