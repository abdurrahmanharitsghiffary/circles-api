import { getEnv } from "@/utils/env";

export const ERROR_MESSAGE = Object.freeze({
  threadNotFound: "Thread not found.",
  invalidCredentials: "Invalid Credentials.",
  userNotFound: "User not found.",
  replyNotFound: "Reply not found.",
  notFound: (key: string) => `${key} not found.`,
  unauthoredModify: (key: string) =>
    `Cannot delete or modify another user ${key}.`,
});

export const NODE_ENV = getEnv("NODE_ENV");
