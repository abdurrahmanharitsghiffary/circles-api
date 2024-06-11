import { ApiResponse } from "@/libs/response";
import rateLimit from "express-rate-limit";

export const signInLimiter = rateLimit({
  windowMs: 1000 * 60 * 30,
  limit: 5,
  message: new ApiResponse(
    null,
    429,
    "Too many failed sign-in attempts from this device. Please wait for 30 minutes before trying again."
  ),
  skipSuccessfulRequests: true,
});

export const signUpLimiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 60 * 24,
  message: new ApiResponse(
    null,
    429,
    "Too many registration attempts from this device. Please wait for 1 day before trying again."
  ),
});

export const refreshTokenLimiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 60,
  message: new ApiResponse(
    null,
    429,
    "Too many request attempts to refresh access token, please wait for 1 hour to refresh your access token."
  ),
});

export const forgotPasswordLimiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 60 * 12,
  message: new ApiResponse(
    null,
    429,
    "Too many request attemps from this device, please wait for 12 hours to make another forgot password request."
  ),
});

export const apiLimiter = rateLimit({
  limit: 300,
  windowMs: 1000 * 60 * 60,
  // keyGenerator: (req) => {
  //   const ip = req.clientIp;
  //   const userId = `${req?.auth?.user?.id}${ip}`;
  //   return userId?.toString() ?? ip;
  // },
  message: new ApiResponse(
    null,
    429,
    "Rate limit reached. Please wait for 1 hour before trying to make a request again."
  ),
});
