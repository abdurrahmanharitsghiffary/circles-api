import express from "express";
import { authController } from "@/controllers/auth";
import {
  signInLimiter,
  forgotPasswordLimiter,
  refreshTokenLimiter,
  signUpLimiter,
} from "@/middlewares/limiter";
const router = express.Router();

router.post("/sign-in", signInLimiter, authController.signIn);

router.post("/sign-up", signUpLimiter, authController.signUp);

router.post("/refresh", refreshTokenLimiter, authController.refreshToken);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword
);
router.post("/reset-password/:token", authController.resetPassword);

export default router;
