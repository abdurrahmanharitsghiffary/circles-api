import { $Enums } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import { JWT } from "@/config/env";
import { AppResponse } from "@/types/express";

type TokenPayload = {
  id: number;
  role: $Enums.UserRole;
  username: string;
  firstName: string;
  lastName: string;
  photoProfile?: string;
  coverPicture?: string;
};

export type TokenDecodedPayload = {
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
    return new Promise((resolve) => {
      resolve(
        jwt.sign(payload, JWT.ACCESS_TOKEN_SECRET, {
          expiresIn: JWT.ACCESS_TOKEN_EXPIRES,
        })
      );
    });
  }

  static async verifyAccessToken(token: string): Promise<TokenDecodedPayload> {
    return new Promise((resolve) => {
      const decoded = jwt.verify(token, JWT.ACCESS_TOKEN_SECRET);
      resolve(decoded as TokenDecodedPayload);
    });
  }

  static async generateRefreshToken(payload: {
    id: number;
    role: $Enums.UserRole;
  }) {
    return new Promise<string>((resolve) => {
      resolve(
        jwt.sign(payload, JWT.REFRESH_TOKEN_SECRET, {
          expiresIn: JWT.REFRESH_TOKEN_EXPIRES,
        })
      );
    });
  }

  static async verifyRefreshToken(token: string): Promise<unknown> {
    return new Promise((resolve) => {
      const decoded = jwt.verify(token, JWT.REFRESH_TOKEN_SECRET);
      resolve(decoded);
    });
  }

  static saveRefreshTokenToCookie(res: AppResponse, token: string) {
    res.cookie("clc.app.session", token, cookieOptions);
    res.cookie("clc.app.session", token, {
      ...cookieOptions,
      path: "/api/v1/auth/sign-out",
    });
  }

  static clearRefreshTokenFromCookie(res: AppResponse) {
    res.clearCookie("clc.app.session", cookieOptions);
    res.clearCookie("clc.app.session", {
      ...cookieOptions,
      path: "/api/v1/auth/sign-out",
    });
  }
}
