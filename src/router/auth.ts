import express from "express";
import { AuthController } from "@/controllers/auth";
import {
  signInLimiter,
  forgotPasswordLimiter,
  refreshTokenLimiter,
  signUpLimiter,
} from "@/middlewares/limiter";
const router = express.Router();

router.post("/sign-in", signInLimiter, AuthController.use("signIn"));

router.post("/sign-up", signUpLimiter, AuthController.use("signUp"));

router.post(
  "/refresh",
  refreshTokenLimiter,
  AuthController.use("refreshToken")
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  AuthController.use("forgotPassword")
);
router.post("/reset-password/:token", AuthController.use("resetPassword"));

export default router;
