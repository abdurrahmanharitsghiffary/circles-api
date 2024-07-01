import { ENV } from "@/config/env";
import { Controller } from "@/decorators/factories/controller";
import { Get } from "@/decorators/factories/httpMethod";
import { Middleware } from "@/decorators/factories/middleware";
import { OAuthService } from "@/services/oauthService";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";

const signInUrl = ENV.CLIENT_BASE_URL + "/auth/sign-in";

passport.use(
  new TwitterStrategy(
    {
      includeEmail: true,
      consumerKey: ENV.OAUTH.TWITTER_CLIENT_ID,
      consumerSecret: ENV.OAUTH.TWITTER_CLIENT_SECRET,
      callbackURL: ENV.BASE_URL + "/oauth/twitter/callback",
    },
    OAuthService.verifyStrategy("TWITTER")
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.OAUTH.GOOGLE_CLIENT_ID,
      clientSecret: ENV.OAUTH.GOOGLE_CLIENT_SECRET,
      scope: ["profile", "email"],
      callbackURL: ENV.BASE_URL + "/oauth/google/callback",
    },
    OAuthService.verifyStrategy("GOOGLE")
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: ENV.OAUTH.FACEBOOK_CLIENT_ID,
      clientSecret: ENV.OAUTH.FACEBOOK_CLIENT_SECRET,
      scope: ["email", "public_profile"],
      profileFields: ["id", "emails", "name"],
      callbackURL: ENV.BASE_URL + "/oauth/facebook/callback",
    },
    OAuthService.verifyStrategy("FACEBOOK")
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

@Controller("/oauth")
export class OAuthController {
  @Get("/google")
  @Middleware(
    passport.authenticate("google", {
      session: false,
      failureRedirect: signInUrl,
      scope: ["profile", "email"],
    })
  )
  async google() {}

  @Get("/google/callback")
  @Middleware(
    passport.authenticate("google", {
      failureRedirect: signInUrl,
      session: false,
    })
  )
  @Middleware(OAuthService.callback)
  async googleCallback() {}

  @Get("/facebook")
  @Middleware(
    passport.authenticate("facebook", {
      session: false,
      failureRedirect: signInUrl,
      scope: ["email", "public_profile"],
    })
  )
  async facebook() {}

  @Get("/facebook/callback")
  @Middleware(
    passport.authenticate("facebook", {
      failureRedirect: signInUrl,
      session: false,
    })
  )
  @Middleware(OAuthService.callback)
  async facebookCallback() {}

  @Get("/twitter")
  @Middleware(
    passport.authenticate("twitter", {
      failureRedirect: signInUrl,
      scope: ["tweet.read", "users.read"],
    })
  )
  async twitter() {}

  @Get("/twitter/callback")
  @Middleware(
    passport.authenticate("twitter", {
      failureRedirect: signInUrl,
    })
  )
  @Middleware(OAuthService.callback)
  async twitterCallback() {}
}
