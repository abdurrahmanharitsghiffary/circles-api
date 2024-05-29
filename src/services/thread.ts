import { Thread } from "../entities/Thread";
import { assignProps } from "../libs/assignProps";
import { RequestError } from "../libs/error";
import { ExcludeEntityMethodAndTimeStamp } from "../types";
import { PaginationBase } from "../types/pagination";

export type ThreadCreateDto = ExcludeEntityMethodAndTimeStamp<
  Omit<Thread, "id">
>;
export type ThreadUpdateDto = Partial<ExcludeEntityMethodAndTimeStamp<Thread>>;

export class ThreadService {
  static async findAll({ limit = 20, offset = 0 }: PaginationBase) {
    return await Thread.findAndCount({
      skip: offset,
      take: limit,
      order: { content: "ASC", createdAt: "DESC" },
    });
  }

  static async find(id: Thread["id"]) {
    const thread = await Thread.findOneBy({ id });
    if (!thread) throw new RequestError("Thread not found.", 404);
    return thread;
  }

  static async create(data: ThreadCreateDto) {
    const thread = new Thread();
    assignProps(thread, data);
    await thread.save();
    return thread;
  }

  static async update(newData: ThreadUpdateDto) {
    const { id, ...data } = newData;
    const thread = await this.find(id);
    assignProps(thread, data);
    return await Thread.save(thread);
  }

  static async delete(id: Thread["id"]) {
    const thread = await this.find(id);
    return await Thread.remove(thread);
  }
}
