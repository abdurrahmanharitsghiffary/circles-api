import express from "express";
import { AuthController } from "@/controllers/auth";
const router = express.Router();

router.post("/sign-in", AuthController.use("signIn"));

router.post("/sign-up", AuthController.use("signUp"));

router.post("/refresh", AuthController.use("refreshToken"));

export default router;
