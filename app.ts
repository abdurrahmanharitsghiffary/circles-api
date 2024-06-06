import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Router } from "@/router";
import { getEnv } from "@/utils/env";

const app = express();

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser(getEnv("COOKIE_SECRET")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = new Router(app);
router.v1();

export default app;
