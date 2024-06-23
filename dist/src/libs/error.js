"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeError = exports.UnauthorizedError = exports.UnauthenticatedError = exports.NotFoundError = exports.BadRequestError = exports.RequestError = void 0;
const response_1 = require("./response");
class RequestError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
        this.success = false;
        this.name = "RequestError";
        this.code = "E_REQUEST";
    }
}
exports.RequestError = RequestError;
class BadRequestError extends RequestError {
    constructor(message) {
        super(message, 400);
        this.name = "BadRequestError";
        this.code = "E_BAD_REQUEST";
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends RequestError {
    constructor(message) {
        super(message, 404);
        this.name = "NotFoundError";
        this.code = "E_NOT_FOUND";
    }
}
exports.NotFoundError = NotFoundError;
class UnauthenticatedError extends RequestError {
    constructor(message = "You are unauthenticated.") {
        super(message, 401);
        this.name = "UnauthenticatedError";
        this.code = "E_UNAUTHENTICATED";
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
class UnauthorizedError extends RequestError {
    constructor(message = "Access Denied.") {
        super(message, 403);
        this.name = "UnauthorizedError";
        this.code = "E_UNAUTHORIZED";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class SafeError extends response_1.ApiResponse {
    constructor(message, status = 200) {
        super(null, status, message);
    }
}
exports.SafeError = SafeError;
//# sourceMappingURL=error.js.map