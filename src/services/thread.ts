import { Thread } from "../entities/Thread";
import { assignProps } from "../libs/assignProps";
import { ERROR_MESSAGE } from "../libs/consts";
import { NotFoundError } from "../libs/error";
import { PaginationBase } from "../types/pagination";
import { ThreadCreateDTO, ThreadUpdateDTO } from "../types/thread-dto";

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
    if (!thread) throw new NotFoundError(ERROR_MESSAGE.threadNotFound);
    return thread;
  }

  static async create(data: ThreadCreateDTO) {
    const thread = new Thread();
    assignProps(thread, data);
    await thread.save();
    return thread;
  }

  static async update(id: number, newData: ThreadUpdateDTO) {
    const { ...data } = newData;
    const thread = await this.find(id);
    assignProps(thread, data);
    return await Thread.save(thread);
  }

  static async delete(id: Thread["id"]) {
    const thread = await this.find(id);
    return await Thread.remove(thread);
  }
}
