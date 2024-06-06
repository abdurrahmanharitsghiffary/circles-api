import { Thread } from "@prisma/client";
import { CreateDTO, UpdateDTO } from ".";

export type ThreadCreateDTO = CreateDTO<Thread>;
export type ThreadUpdateDTO = UpdateDTO<Omit<Thread, "authorId">>;
