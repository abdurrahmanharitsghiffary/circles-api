import { $Enums } from "@prisma/client";
import jwt from "jsonwebtoken";
import { getEnv } from "@/utils/env";
import { CookieOptions, Response } from "express";

type TokenPayload = {
  id: number;
  role: $Enums.UserRole;
  username: string;
  firstName: string;
  lastName: string;
  photoProfile?: string;
  coverPicture?: string;
};

type TokenDecodedPayload = {
  iat: number;
  exp: number;
} & TokenPayload;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/api/v1/auth/refresh",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export class JWTService {
  static async generateAccessToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(
        jwt.sign(payload, getEnv("ACCESS_TOKEN_SECRET"), { expiresIn: "1h" })
      );
    });
  }

  static async verifyAccessToken(token: string): Promise<TokenDecodedPayload> {
    return new Promise((resolve, reject) => {
      const decoded = jwt.verify(token, getEnv("ACCESS_TOKEN_SECRET"));
      resolve(decoded as TokenDecodedPayload);
    });
  }

  static async generateRefreshToken(payload: {
    id: number;
    role: $Enums.UserRole;
  }) {
    return new Promise<string>((resolve, reject) => {
      resolve(
        jwt.sign(payload, getEnv("REFRESH_TOKEN_SECRET"), { expiresIn: "7d" })
      );
    });
  }

  static async verifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const decoded = jwt.verify(token, getEnv("REFRESH_TOKEN_SECRET"));
      resolve(decoded);
    });
  }

  static saveRefreshTokenToCookie(res: Response, token: string) {
    res.cookie("clc.app.session", token, cookieOptions);
    res.cookie("clc.app.session", token, {
      ...cookieOptions,
      path: "/api/v1/auth/sign-out",
    });
  }

  static clearRefreshTokenFromCookie(res: Response) {
    res.clearCookie("clc.app.session", cookieOptions);
    res.clearCookie("clc.app.session", {
      ...cookieOptions,
      path: "/api/v1/auth/sign-out",
    });
  }
}
