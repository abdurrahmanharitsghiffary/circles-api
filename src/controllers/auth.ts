import { Request, Response } from "express";
import { Controller } from ".";
import { SignInDTO, SignUpDTO } from "@/types/auth-dto";
import { Validate } from "@/decorators/factories/validate";
import { signInSchema, signUpSchema } from "@/schema/auth";
import { AuthService } from "@/services/auth";
import { NoContent, Success } from "@/libs/response";
import { UnauthenticatedError, UnauthorizedError } from "@/libs/error";
import { RefreshTokenService } from "@/services/refreshToken";
import { getIp } from "@/utils/getIp";
import { decrypt } from "@/utils/encrypt";
import UserService from "@/services/user";
import { JWTService } from "@/services/jwt";

export class AuthController extends Controller {
  @Validate({ body: signInSchema })
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body as SignInDTO;
    const ip = getIp(req);
    const { accessToken, refreshToken, user } = await AuthService.signIn({
      email,
      password,
    });

    JWTService.saveRefreshTokenToCookie(res, refreshToken);
    await RefreshTokenService.create(refreshToken, user.id, ip);

    return res.json(
      new Success({ accessToken }, "Successfully sign in to your account.")
    );
  }

  @Validate({ body: signUpSchema })
  async signUp(req: Request, res: Response) {
    const { email, password, firstName, username, lastName } =
      req.body as SignUpDTO;
    const ip = getIp(req);
    const { accessToken, refreshToken, user } = await AuthService.signUp({
      email,
      password,
      firstName,
      username,
      lastName,
    });

    JWTService.saveRefreshTokenToCookie(res, refreshToken);
    await RefreshTokenService.create(refreshToken, user.id, ip);

    return res.json(
      new Success({ accessToken }, "Account successfully registered.")
    );
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies["clc.app.session"];
    console.log(refreshToken, "REFRESH TOKEN");
    const ip = getIp(req);

    if (!refreshToken) throw new UnauthenticatedError();
    const token = await RefreshTokenService.find(refreshToken);
    if (!token) throw new UnauthenticatedError();

    const decoded = await JWTService.verifyRefreshToken(refreshToken);

    if (!decoded) throw new UnauthorizedError("Invalid refresh token.");

    const refreshTokenIp = await decrypt(token.ipv4);
    if (refreshTokenIp !== ip) throw new UnauthorizedError();

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

  async signOut(req: Request, res: Response) {
    const refreshToken = req.cookies["clc.app.session"];
    if (!refreshToken) throw new UnauthenticatedError();

    await RefreshTokenService.delete(refreshToken);
    JWTService.clearRefreshTokenFromCookie(res);

    return res
      .status(200)
      .json(new NoContent("Successfully signed out from account."));
  }
}
