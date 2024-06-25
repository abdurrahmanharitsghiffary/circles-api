import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Router } from "@/router";
import { mw } from "request-ip";
import { ENV } from "@/config/env";

const app = express();

const whitelist = ["http://localhost:5173", "http://localhost:4173"];

app.set("trust proxy", 1);
app.use(mw());
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = new Router(app);
router.v1();

export default app;
