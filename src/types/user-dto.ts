import { CreateDTO, UpdateDTO } from ".";
import {
  UserBaseSelectPayload,
  UserSelectPayload,
} from "../query/select/userSelect";
import { SetOptional } from "type-fest";

export type UserCreateDTO = CreateDTO<
  SetOptional<
    Omit<UserSelectPayload, "_count" | "role">,
    "lastName" | "bio" | "photoProfile" | "coverPicture"
  >
>;
export type UserUpdateDTO = UpdateDTO<Omit<UserBaseSelectPayload, "_count">>;
