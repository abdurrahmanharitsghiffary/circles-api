import { Thread } from "@prisma/client";
import { CreateDTO, UpdateDTO } from ".";
import { SetOptional } from "type-fest";

type OptionalCreateFields = "images";

export type CreateThreadOptions = CreateDTO<
  SetOptional<Thread, OptionalCreateFields>
>;
export type CreateThreadDTO = Omit<CreateThreadOptions, "authorId">;
export type UpdateThreadDTO = UpdateDTO<Omit<Thread, "authorId">>;
export type UpdateThreadOptions = UpdateThreadDTO;
