"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZKEY = exports.RKEY = exports.MESSAGE = exports.ERROR_MESSAGE = exports.TYPES = void 0;
exports.TYPES = {
    BASE_URL: Symbol("BASE_URL"),
    HTTP_METHOD: Symbol("HTTP_METHOD"),
    ENDPOINT: Symbol("ENDPOINT"),
    MIDDLEWARES: Symbol("MIDDLEWARES"),
    CONTROLLER: Symbol("CONTROLLER"),
    HANDLER: Symbol("HANDLER"),
};
exports.ERROR_MESSAGE = {
    threadNotFound: "Thread not found.",
    invalidCredentials: "Invalid Credentials.",
    userNotFound: "User not found.",
    replyNotFound: "Reply not found.",
    notFound: (key) => `${key} not found.`,
    unauthoredModify: (key) => `Cannot delete or modify another user ${key}.`,
};
exports.MESSAGE = {
    resetPassword: "If a matching email is found and already verified, a password reset link will be sent to your email address. Please check your inbox and follow the instructions to reset your password.",
};
exports.RKEY = {
    GEN_PKEY: (id, req, meta) => `${id}?l=${req.pagination.limit}&o=${req.pagination.offset}${meta ? "&" + meta.map((m) => m.join("=")).join("&") : ""}`,
    SEARCH: (req) => {
        var _a, _b, _c, _d;
        return exports.RKEY.GEN_PKEY("SEARCH", req, [
            ["t", (_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.toString()],
            ["q", (_d = (_c = req.query) === null || _c === void 0 ? void 0 : _c.q) === null || _d === void 0 ? void 0 : _d.toString()],
        ]);
    },
    THREADS: (req) => exports.RKEY.GEN_PKEY("THREADS", req),
    THREAD: (req) => { var _a, _b; return `THREAD/${(_b = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""}`; },
};
var ZKEY;
(function (ZKEY) {
    ZKEY["THREADS"] = "THREADS";
})(ZKEY || (exports.ZKEY = ZKEY = {}));
//# sourceMappingURL=consts.js.map