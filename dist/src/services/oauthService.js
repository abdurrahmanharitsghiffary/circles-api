"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const models_1 = require("@/models");
const userSelect_1 = require("@/query/select/userSelect");
const jwtService_1 = require("./jwtService");
const env_1 = require("@/config/env");
const genUsername_1 = require("@/utils/genUsername");
class OAuthService {
    static verifyStrategy(providerType) {
        return function (accessToken, refreshToken, profile, done) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                try {
                    const [firstN, lastN] = (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.displayName) === null || _a === void 0 ? void 0 : _a.split(" ")) !== null && _b !== void 0 ? _b : "";
                    const email = (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
                    const firstName = (_f = (_e = profile === null || profile === void 0 ? void 0 : profile.name) === null || _e === void 0 ? void 0 : _e.givenName) !== null && _f !== void 0 ? _f : firstN;
                    const lastName = (_h = (_g = profile === null || profile === void 0 ? void 0 : profile.name) === null || _g === void 0 ? void 0 : _g.familyName) !== null && _h !== void 0 ? _h : lastN;
                    console.log(email, "EMAIL");
                    console.log(profile, "PROFILE");
                    const user = yield models_1.User.findUnique({
                        where: { email },
                        select: Object.assign(Object.assign({}, userSelect_1.userSelect), { providerType: true }),
                    });
                    console.log(user, "USER");
                    console.log(providerType, "PROVIDERTYPE");
                    if (user && user.providerType !== providerType)
                        return done(new Error(`Email already used by ${user.providerType} account.`), false);
                    if (!user) {
                        let uniqueUsername = (_u = (_o = (_j = profile === null || profile === void 0 ? void 0 : profile.username) !== null && _j !== void 0 ? _j : (_m = (_l = (_k = profile === null || profile === void 0 ? void 0 : profile.displayName) === null || _k === void 0 ? void 0 : _k.split(" ")) === null || _l === void 0 ? void 0 : _l.join("")) === null || _m === void 0 ? void 0 : _m.toLowerCase()) !== null && _o !== void 0 ? _o : (_t = (_s = (_r = (((_p = profile === null || profile === void 0 ? void 0 : profile.name) === null || _p === void 0 ? void 0 : _p.givenName) + ((_q = profile === null || profile === void 0 ? void 0 : profile.name) === null || _q === void 0 ? void 0 : _q.familyName))) === null || _r === void 0 ? void 0 : _r.split(" ")) === null || _s === void 0 ? void 0 : _s.join("")) === null || _t === void 0 ? void 0 : _t.toLowerCase()) !== null && _u !== void 0 ? _u : (0, genUsername_1.genUsername)("");
                        const usernameIsExists = yield models_1.User.findUnique({
                            where: { username: uniqueUsername },
                        });
                        if (usernameIsExists) {
                            uniqueUsername += Date.now().toString();
                        }
                        const newUser = yield models_1.User.create({
                            data: {
                                isVerified: true,
                                password: "",
                                email,
                                photoProfile: ((_w = (_v = profile.photos) === null || _v === void 0 ? void 0 : _v[0]) === null || _w === void 0 ? void 0 : _w.value) || undefined,
                                firstName,
                                lastName,
                                username: uniqueUsername,
                                providerType,
                                providerId: profile.id,
                            },
                            select: userSelect_1.userSelect,
                        });
                        return done(null, newUser);
                    }
                    done(null, user);
                }
                catch (err) {
                    done(err, false);
                }
            });
        };
    }
    static callback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req === null || req === void 0 ? void 0 : req.user;
            console.log("FROM CALLBCAK");
            console.log(user, "USER");
            const accessToken = yield jwtService_1.JWTService.generateAccessToken({
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                id: user === null || user === void 0 ? void 0 : user.id,
                role: user === null || user === void 0 ? void 0 : user.role,
                username: user === null || user === void 0 ? void 0 : user.username,
                coverPicture: user === null || user === void 0 ? void 0 : user.coverPicture,
                photoProfile: user === null || user === void 0 ? void 0 : user.photoProfile,
            });
            const refreshToken = yield jwtService_1.JWTService.generateRefreshToken({
                id: user === null || user === void 0 ? void 0 : user.id,
                role: user === null || user === void 0 ? void 0 : user.role,
            });
            jwtService_1.JWTService.saveRefreshTokenToCookie(res, refreshToken);
            const url = new URL("/oauth/callback", env_1.ENV.CLIENT_BASE_URL);
            url.searchParams.set("token", accessToken);
            res.redirect(url.href);
        });
    }
}
exports.OAuthService = OAuthService;
//# sourceMappingURL=oauthService.js.map