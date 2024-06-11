import { RefreshToken } from "@prisma/client";
import { ExcludeTimeStamp } from ".";
import { SetOptional } from "type-fest";

type ExcludedCreateFields = "revokedAt" | "id" | "isInvalid" | "userAgentId";
type OptionalFields = "expiresAt";

export type CreateRefreshTokenOptions = SetOptional<
  Omit<ExcludeTimeStamp<RefreshToken>, ExcludedCreateFields>,
  OptionalFields
>;
