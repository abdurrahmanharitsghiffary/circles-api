"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthController = void 0;
const env_1 = require("@/config/env");
const controller_1 = require("@/decorators/factories/controller");
const httpMethod_1 = require("@/decorators/factories/httpMethod");
const middleware_1 = require("@/decorators/factories/middleware");
const oauthService_1 = require("@/services/oauthService");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_twitter_1 = require("passport-twitter");
const signInUrl = env_1.ENV.CLIENT_BASE_URL + "/auth/sign-in";
passport_1.default.use(new passport_twitter_1.Strategy({
    includeEmail: true,
    consumerKey: env_1.ENV.OAUTH.TWITTER_CLIENT_KEY,
    consumerSecret: env_1.ENV.OAUTH.TWITTER_CLIENT_SECRET,
    callbackURL: env_1.ENV.BASE_URL + "/oauth/twitter/callback",
}, oauthService_1.OAuthService.verifyStrategy("TWITTER")));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.ENV.OAUTH.GOOGLE_CLIENT_ID,
    clientSecret: env_1.ENV.OAUTH.GOOGLE_CLIENT_SECRET,
    scope: ["profile", "email"],
    callbackURL: env_1.ENV.BASE_URL + "/oauth/google/callback",
}, oauthService_1.OAuthService.verifyStrategy("GOOGLE")));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: env_1.ENV.OAUTH.FACEBOOK_CLIENT_ID,
    clientSecret: env_1.ENV.OAUTH.FACEBOOK_CLIENT_SECRET,
    scope: ["email", "public_profile"],
    profileFields: ["id", "emails", "name"],
    callbackURL: env_1.ENV.BASE_URL + "/oauth/facebook/callback",
}, oauthService_1.OAuthService.verifyStrategy("FACEBOOK")));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (obj, done) {
    done(null, obj);
});
let OAuthController = class OAuthController {
    google() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    googleCallback() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    facebook() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    facebookCallback() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    twitter() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    twitterCallback() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
};
exports.OAuthController = OAuthController;
__decorate([
    (0, httpMethod_1.Get)("/google"),
    (0, middleware_1.Middleware)(passport_1.default.authenticate("google", {
        session: false,
        scope: ["profile", "email"],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "google", null);
__decorate([
    (0, httpMethod_1.Get)("/google/callback"),
    (0, middleware_1.Middleware)(passport_1.default.authenticate("google", {
        failureRedirect: signInUrl,
        failureMessage: true,
        session: false,
    })),
    (0, middleware_1.Middleware)(oauthService_1.OAuthService.callback),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "googleCallback", null);
__decorate([
    (0, httpMethod_1.Get)("/facebook"),
    (0, middleware_1.Middleware)(passport_1.default.authenticate("facebook", {
        session: false,
        scope: ["email", "public_profile"],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "facebook", null);
__decorate([
    (0, httpMethod_1.Get)("/facebook/callback"),
    (0, middleware_1.Middleware)(passport_1.default.authenticate("facebook", {
        failureRedirect: signInUrl,
        failureMessage: true,
        session: false,
    })),
    (0, middleware_1.Middleware)(oauthService_1.OAuthService.callback),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "facebookCallback", null);
__decorate([
    (0, httpMethod_1.Get)("/twitter"),
    (0, middleware_1.Middleware)(passport_1.default.authenticate("twitter", {
        scope: ["tweet.read", "users.read"],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "twitter", null);
__decorate([
    (0, httpMethod_1.Get)("/twitter/callback"),
    (0, middleware_1.Middleware)(passport_1.default.authenticate("twitter", {
        failureRedirect: signInUrl,
        failureMessage: true,
    })),
    (0, middleware_1.Middleware)(oauthService_1.OAuthService.callback),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "twitterCallback", null);
exports.OAuthController = OAuthController = __decorate([
    (0, controller_1.Controller)("/oauth")
], OAuthController);
//# sourceMappingURL=oauthController.js.map