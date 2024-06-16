import { AppRequest, AppResponse } from "@/types/express";
import { Controller } from ".";
import { SignInDTO, SignUpDTO } from "@/types/authDto";
import { Validate } from "@/decorators/factories/validate";
import { resetPasswordSchema, signInSchema, signUpSchema } from "@/schema/auth";
import { AuthService } from "@/services/auth";
import { NoContent, Success } from "@/libs/response";
import {
  RequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "@/libs/error";
import { RefreshTokenService } from "@/services/refreshToken";
import UserService from "@/services/user";
import { JWTService } from "@/services/jwt";
import Joi from "joi";
import { J } from "@/schema";
import { genRandToken } from "@/utils/genRandToken";
import { Token, User } from "@/models";
import { sendResetPasswordLink } from "@/libs/nodemailer";
import { MESSAGE } from "@/libs/consts";
import { ENV } from "@/config/env";

export class AuthController extends Controller {
  @Validate({ body: signInSchema })
  async signIn(req: AppRequest, res: AppResponse) {
    const { email, password } = req.body as SignInDTO;
    const { accessToken, refreshToken, user } = await AuthService.signIn({
      email,
      password,
    });

    JWTService.saveRefreshTokenToCookie(res, refreshToken);
    await RefreshTokenService.create({ token: refreshToken, userId: user.id });

    return res.json(
      new Success({ accessToken }, "Successfully sign in to your account.")
    );
  }

  @Validate({ body: signUpSchema })
  async signUp(req: AppRequest, res: AppResponse) {
    const { email, password, firstName, username, lastName } =
      req.body as SignUpDTO;
    const { accessToken, refreshToken, user } = await AuthService.signUp({
      email,
      password,
      firstName,
      username,
      lastName,
    });

    JWTService.saveRefreshTokenToCookie(res, refreshToken);
    await RefreshTokenService.create({ token: refreshToken, userId: user.id });

    return res.json(
      new Success({ accessToken }, "Account successfully registered.")
    );
  }

  async refreshToken(req: AppRequest, res: AppResponse) {
    const refreshToken = req.cookies["clc.app.session"];
    console.log(refreshToken, "REFRESH TOKEN");

    if (!refreshToken) throw new UnauthenticatedError();
    const token = await RefreshTokenService.find(refreshToken);
    if (!token) throw new UnauthenticatedError();

    const decoded = await JWTService.verifyRefreshToken(refreshToken);

    if (!decoded) throw new UnauthorizedError("Invalid refresh token.");

    const user = await UserService.findBy("id", token.userId);

    const accessToken = await JWTService.generateAccessToken({
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      coverPicture: user.coverPicture,
      photoProfile: user.photoProfile,
      role: user.role,
      username: user.username,
    });

    return res
      .status(200)
      .json(
        new Success({ accessToken }, "Successfully issued new access token.")
      );
  }

  async signOut(req: AppRequest, res: AppResponse) {
    await AuthService.signOut(req, res);
    return res
      .status(200)
      .json(new NoContent("Successfully signed out from account."));
  }

  @Validate({ body: Joi.object({ email: J.email.required() }) })
  async forgotPassword(req: AppRequest, res: AppResponse) {
    const { email } = req.body;

    try {
      const randToken = await genRandToken();

      const user = await User.findUnique({ where: { email } });

      if (!user.isVerified || !user)
        throw new Error("cuma buat throw ke catch block");

      await Token.create({
        data: {
          token: randToken,
          type: "RESET_TOKEN",
          expiresAt: 1000 * 60 * 5,
          userId: user.id,
        },
      });

      sendResetPasswordLink({
        fullName: `${user?.firstName} ${user?.lastName}`,
        to: email,
        url: `${ENV.CLIENT_BASE_URL}/auth/reset-password/${randToken}`,
      });

      return res.json(new Success(null, MESSAGE.resetPassword));
    } catch (err) {
      return res.json(new Success(null, MESSAGE.resetPassword));
    }
  }

  @Validate({
    body: resetPasswordSchema,
    params: Joi.object({ token: Joi.string().required() }),
  })
  async resetPassword(req: AppRequest, res: AppResponse) {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetToken = await Token.findUnique({
      where: { token, type: "RESET_TOKEN" },
    });
    if (!resetToken) throw new RequestError("Invalid token.", 400);
    const createdAt = new Date(resetToken.createdAt);
    const expiredAt = new Date(createdAt.getTime() + resetToken.expiresAt);
    const isExpired = expiredAt.getTime() < Date.now();
    if (isExpired) {
      await Token.delete({ where: { id: resetToken.id } });
      throw new RequestError(
        "Token already expired, please submit another request to reset your password.",
        400
      );
    }

    await UserService.update(resetToken.userId, { password: newPassword });
    await Token.deleteMany({
      where: { userId: resetToken.userId, type: "RESET_TOKEN" },
    });
    await AuthService.signOut(req, res, false);
    return res
      .status(204)
      .json(
        new NoContent(
          "Password successfully changed, please sign in again to your account."
        )
      );
  }
}