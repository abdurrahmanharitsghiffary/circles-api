import { AppRequest } from "@/types/express";

export const ERROR_MESSAGE = {
  threadNotFound: "Thread not found.",
  invalidCredentials: "Invalid Credentials.",
  userNotFound: "User not found.",
  replyNotFound: "Reply not found.",
  notFound: (key: string) => `${key} not found.`,
  unauthoredModify: (key: string) =>
    `Cannot delete or modify another user ${key}.`,
} as const;

export const MESSAGE = {
  resetPassword:
    "If a matching email is found and already verified, a password reset link will be sent to your email address. Please check your inbox and follow the instructions to reset your password.",
} as const;

export const RKEY = {
  GEN_PKEY: (id: string, req: AppRequest, meta?: [string, string][]) =>
    `${id}?l=${req.pagination.limit}&o=${req.pagination.offset}${
      meta ? "&" + meta.map((m) => m.join("=")).join("&") : ""
    }`,
  SEARCH: (req: AppRequest) => {
    return RKEY.GEN_PKEY("SEARCH", req, [
      ["t", req.query?.type?.toString()],
      ["q", req.query?.q?.toString()],
    ]);
  },
  THREADS: (req: AppRequest) => RKEY.GEN_PKEY("THREADS", req),
  THREAD: (req: AppRequest) => `THREAD/${req.params?.id ?? ""}`,
} as const;
