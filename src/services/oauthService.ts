import { User } from "@/models";
import { UserSelectPayload, userSelect } from "@/query/select/userSelect";
import { AppRequest, AppResponse } from "@/types/express";
import { $Enums } from "@prisma/client";
import passport, { Profile } from "passport";
import { JWTService } from "./jwtService";
import { ENV } from "@/config/env";
import { genUsername } from "@/utils/genUsername";
import { VerifyOAuthError } from "@/libs/error";

export class OAuthService {
  static verifyStrategy(providerType: $Enums.ProviderType) {
    return async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: passport.DoneCallback
    ) {
      try {
        const [firstN, lastN] = profile?.displayName?.split(" ") ?? "";
        const email = profile.emails?.[0]?.value;
        const firstName = profile?.name?.givenName ?? firstN;
        const lastName = profile?.name?.familyName ?? lastN;
        console.log(email, "EMAIL");
        console.log(profile, "PROFILE");
        const user = await User.findUnique({
          where: { email },
          select: { ...userSelect, providerType: true },
        });
        console.log(user, "USER");
        console.log(providerType, "PROVIDERTYPE");
        if (user && user.providerType !== providerType)
          return done(
            new VerifyOAuthError(
              `Email already used by ${user.providerType} account.`
            ),
            false
          );

        if (!user) {
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

          const newUser = await User.create({
            data: {
              isVerified: true,
              password: "",
              email,
              photoProfile: profile.photos?.[0]?.value || undefined,
              firstName,
              lastName,
              username: uniqueUsername,
              providerType,
              providerId: profile.id,
            },
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
    console.log("FROM CALLBCAK");
    console.log(user, "USER");
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

    const url = new URL("/oauth/callback", ENV.CLIENT_BASE_URL);

    url.searchParams.set("token", accessToken);

    res.redirect(url.href);
  }
}
