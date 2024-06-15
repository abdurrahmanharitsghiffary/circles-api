import { AppRequest } from "@/types/express";
import { getPagingOptions } from "@/utils/getPagingOptions";

export const ERROR_MESSAGE = Object.freeze({
  threadNotFound: "Thread not found.",
  invalidCredentials: "Invalid Credentials.",
  userNotFound: "User not found.",
  replyNotFound: "Reply not found.",
  notFound: (key: string) => `${key} not found.`,
  unauthoredModify: (key: string) =>
    `Cannot delete or modify another user ${key}.`,
});

export const MESSAGE = Object.freeze({
  resetPassword:
    "If a matching email is found and already verified, a password reset link will be sent to your email address. Please check your inbox and follow the instructions to reset your password.",
});

export const RKEY = Object.freeze({
  SEARCH: (req: AppRequest) => {
    const paging = getPagingOptions(req);
    return `SEARCH:l=${paging.limit}&o=${paging.offset}&t=${
      req?.query?.type ?? "all"
    }&q=${req?.query?.q ?? ""}`;
  },
});
