import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { mw } from "request-ip";
import { ENV, NODE_ENV } from "@/config/env";
import express, { Express } from "express";
import passport from "passport";
import session from "express-session";

const whitelist = ["http://localhost:5173", "http://localhost:4173"];

export const rootMiddleware = (app: Express) => {
  app.use(mw());
  app.use(helmet({ crossOriginEmbedderPolicy: false }));
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (NODE_ENV === "development") return callback(null, true);
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
  app.use(cookieParser(ENV.COOKIE_SECRET));
  app.use(passport.initialize());
  app.use(
    session({
      secret: ENV.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
};
