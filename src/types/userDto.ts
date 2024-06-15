import { CreateDTO } from ".";
import { UserSelectPayload } from "../query/select/userSelect";
import { SetOptional } from "type-fest";

export type CreateUserDTO = CreateDTO<
  SetOptional<
    Omit<UserSelectPayload, "_count" | "role">,
    "lastName" | "bio" | "photoProfile" | "coverPicture"
  >
>;

export type CreateUserOptions = CreateUserDTO;

export type UpdateUserOptions = Partial<CreateUserDTO>;

export type UpdateUserDTO = Partial<
  Pick<
    UserSelectPayload,
    | "bio"
    | "coverPicture"
    | "firstName"
    | "lastName"
    | "photoProfile"
    | "username"
  >
>;
