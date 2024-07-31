import { User } from "@/models";
import { UserSelectPayload, userSelect } from "@/query/select/userSelect";
import { AppRequest, AppResponse } from "@/types/express";
import { $Enums, Prisma } from "@prisma/client";
import passport, { Profile } from "passport";
import { JWTService } from "./jwtService";
import { ENV } from "@/config/env";
import { genUsername } from "@/utils/genUsername";
import { VerifyOAuthError } from "@/libs/error";
import { RefreshTokenService } from "./refreshTokenService";

export class OAuthService {
  static verifyStrategy(providerType: $Enums.ProviderType) {
    return async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: passport.DoneCallback
    ) {
      try {
        let email = profile.emails?.[0]?.value;

        if (!email && providerType === "GITHUB") {
          const requestOptions = {
            headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
          };

          const response = await fetch("https://api.github.com/user/emails", {
            ...requestOptions,
          });

          const data: {
            primary: boolean;
            email: string;
            verified: boolean;
            visibility: string | null;
          }[] = await response.json();

          const ghEmail = (data ?? []).find((email) => email.primary === true);
          if (ghEmail) email = ghEmail.email;
        }

        if (!email)
          throw new VerifyOAuthError(
            `Can't get ${providerType?.toLowerCase()} account email address.`
          );

        const user = await User.findUnique({
          where: { email },
          select: { ...userSelect, providerType: true },
        });

        // if (user && user.providerType !== providerType)
        //   return done(
        //     new VerifyOAuthError(
        //       `Email already used by ${
        //         user.providerType || "credentials"
        //       } account.`
        //     ),
        //     false
        //   );

        if (!user) {
          const [firstN, lastN] = profile?.displayName?.split(" ") ?? "";
          const firstName = profile?.name?.givenName ?? firstN;
          const lastName = profile?.name?.familyName ?? lastN;

          let uniqueUsername =
            profile?.username ??
            profile?.displayName?.split(" ")?.join("")?.toLowerCase() ??
            (profile?.name?.givenName + profile?.name?.familyName)
              ?.split(" ")
              ?.join("")
              ?.toLowerCase() ??
            genUsername("");

          const usernameIsExists = await User.findUnique({
            where: { username: uniqueUsername },
          });

          if (usernameIsExists) {
            uniqueUsername += Date.now().toString();
          }

          const data: Prisma.UserCreateInput = {
            isVerified: true,
            password: "",
            email,
            firstName: "",
            photoProfile: profile.photos?.[0]?.value || undefined,
            username: uniqueUsername,
            providerType,
            providerId: profile.id,
          };

          if (providerType === "GITHUB") {
            data.firstName = profile?.displayName;
          } else {
            data.firstName = firstName;
            data.lastName = lastName;
          }

          const newUser = await User.create({
            data,
            select: userSelect,
          });

          return done(null, newUser);
        }

        done(null, user);
      } catch (err) {
        done(new VerifyOAuthError(err?.message), false);
      }
    };
  }

  static async callback(req: AppRequest, res: AppResponse) {
    const user = req?.user as UserSelectPayload;

    const accessToken = await JWTService.generateAccessToken({
      firstName: user?.firstName,
      lastName: user?.lastName,
      id: user?.id,
      role: user?.role,
      username: user?.username,
      coverPicture: user?.coverPicture,
      photoProfile: user?.photoProfile,
    });

    const refreshToken = await JWTService.generateRefreshToken({
      id: user?.id,
      role: user?.role,
    });
    JWTService.saveRefreshTokenToCookie(res, refreshToken);
    await RefreshTokenService.create({ token: refreshToken, userId: user?.id });
    const url = new URL("/oauth/callback", ENV.CLIENT_BASE_URL);

    url.searchParams.set("token", accessToken);

    res.redirect(url.href);
  }
}
