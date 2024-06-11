import { Reply } from "@prisma/client";
import { CreateDTO, UpdateDTO } from ".";
import { SetOptional } from "type-fest";

type OptionalCreateFields = "parentId" | "image";
type ExcludedCreateFields = "authorId" | "threadId";
type ExcludedUpdateFields = "authorId" | "threadId" | "parentId";

export type CreateReplyOptions = CreateDTO<
  SetOptional<Reply, OptionalCreateFields>
>;
export type CreateReplyDTO = Omit<CreateReplyOptions, ExcludedCreateFields>;
export type UpdateReplyDTO = UpdateDTO<Omit<Reply, ExcludedUpdateFields>>;
export type UpdateReplyOptions = UpdateReplyDTO;
