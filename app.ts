import express from "express";
import { Router } from "@/router";
import { rootMiddleware } from "@/middlewares";

const app = express();

app.set("trust proxy", 1);
rootMiddleware(app);

const router = new Router(app);
router.v1();

export default app;
