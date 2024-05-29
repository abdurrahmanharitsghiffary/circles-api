import express from "express";
import cors from "cors";
import { Router } from "./src/router";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = new Router(app);
router.v1();

export default app;
