import { Request } from "express";
import { ERROR_MESSAGE } from "@/libs/consts";
import { RequestError, UnauthenticatedError } from "@/libs/error";
import { SignInDTO, SignUpDTO } from "@/types/auth-dto";
import UserService from "./user";
import bcrypt from "bcrypt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { JWTService } from "./jwt";

export class AuthService {
  static async verifyAuth(req: Request, optional: boolean = false) {
    const authorization = req.headers?.authorization ?? "";
    const [tokenType, token] = authorization.split(" ");

    if (!token && optional) return;

    if (!token) throw new UnauthenticatedError("No token provided.");

    if (tokenType !== "Bearer")
      throw new RequestError("Invalid token type.", 401);

    try {
      const decodedToken = await JWTService.verifyAccessToken(token);

      delete decodedToken.iat;
      delete decodedToken.exp;

      req.auth = {
        isLoggedIn: true,
        user: decodedToken as any,
      };
    } catch (err) {
      const isTokenErrorButOptionalAuthorization =
        (err instanceof TokenExpiredError ||
          err instanceof JsonWebTokenError) &&
        optional;

      if (isTokenErrorButOptionalAuthorization) return;
      throw err;
    }
  }

  static async signUp({
    email,
    username,
    firstName,
    password,
    lastName,
  }: Omit<SignUpDTO, "confirmPassword">) {
    const createdUser = await UserService.create({
      email,
      firstName,
      password,
      username,
      lastName,
    });

    const role = await UserService.getRole(createdUser.id);

    const accessToken = await JWTService.generateAccessToken({
      id: createdUser.id,
      photoProfile: createdUser.photoProfile,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      username: createdUser.username,
      role,
    });

    const refreshToken = await JWTService.generateRefreshToken({
      id: createdUser.id,
      role,
    });

    return { accessToken, refreshToken, user: createdUser };
  }

  static async signIn({ email, password }: Omit<SignInDTO, "confirmPassword">) {
    const user = await UserService.findBy("email", email, false);

    if (!user) throw new RequestError(ERROR_MESSAGE.invalidCredentials, 400);

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw new RequestError(ERROR_MESSAGE.invalidCredentials, 400);

    const accessToken = await JWTService.generateAccessToken({
      id: user.id,
      role: user.role,
      coverPicture: user.coverPicture,
      photoProfile: user.photoProfile,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });

    const refreshToken = await JWTService.generateRefreshToken({
      id: user.id,
      role: user.role,
    });

    return { accessToken, refreshToken, user };
  }
}
