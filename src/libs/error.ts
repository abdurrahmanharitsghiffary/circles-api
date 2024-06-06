import { ApiResponse } from "./response";

export class RequestError extends Error {
  code?: string;
  success = false;

  constructor(public message: string, public status: number) {
    super(message);
    this.name = "RequestError";
    this.code = "E_REQUEST";
  }
}

export class BadRequestError extends RequestError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
    this.code = "E_BAD_REQUEST";
  }
}

export class NotFoundError extends RequestError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
    this.code = "E_NOT_FOUND";
  }
}

export class UnauthenticatedError extends RequestError {
  constructor(message: string = "You are unauthenticated.") {
    super(message, 401);
    this.name = "UnauthenticatedError";
    this.code = "E_UNAUTHENTICATED";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Access Denied.") {
    super(message, 403);
    this.name = "UnauthorizedError";
    this.code = "E_UNAUTHORIZED";
  }
}

export class SafeError<T> extends ApiResponse<T> {
  constructor(message: string, status: number = 200) {
    super(null, status, message);
  }
}
