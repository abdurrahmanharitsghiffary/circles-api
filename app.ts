import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Router } from "@/router";
import { mw } from "request-ip";
import { ENV } from "@/config/env";

const app = express();

app.use(mw());
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ credentials: true, origin: ENV.CLIENT_BASE_URL }));
app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = new Router(app);
router.v1();

export default app;
