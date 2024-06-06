import { Reply } from "@prisma/client";
import { CreateDTO, UpdateDTO } from ".";

export type CreateReplyDTO = CreateDTO<Reply>;
export type UpdateReplyDTO = UpdateDTO<Omit<Reply, "authorId" | "threadId">>;
