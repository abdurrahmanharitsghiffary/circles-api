import { CreateDTO, UpdateDTO } from ".";
import { Thread } from "../entities/Thread";

export type ThreadCreateDTO = CreateDTO<Thread>;
export type ThreadUpdateDTO = UpdateDTO<Thread>;
