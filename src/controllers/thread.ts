import { Request, Response } from "express";
import { Controller } from ".";
import { ThreadCreateDTO, ThreadUpdateDTO } from "../types/thread-dto";
import { getPagingOptions } from "../libs/getPagingOptions";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "../libs/response";
import { getIdParams } from "../libs/getIdParams";
import { ThreadService } from "../services/thread";

export class ThreadController extends Controller {
  async index(req: Request, res: Response) {
    const paging = getPagingOptions(req);
    const [threads, count] = await ThreadService.findAll(paging);
    console.log(count);

    return res.status(200).json(new ApiPagingResponse(req, threads, count));
  }

  async show(req: Request, res: Response) {
    const threadId = getIdParams(req, "threadId");
    const thread = await ThreadService.find(threadId);

    return res.status(200).json(new Success(thread));
  }

  async store(req: Request, res: Response) {
    const { content, image } = req.body as ThreadCreateDTO;
    const createdThread = await ThreadService.create({ content, image });

    return res
      .status(201)
      .json(new Created(createdThread, "Thread successfully saved."));
  }

  async destroy(req: Request, res: Response) {
    const threadId = getIdParams(req, "threadId");
    await ThreadService.delete(threadId);

    return res.status(204).json(new NoContent("Thread successfully deleted."));
  }

  async update(req: Request, res: Response) {
    const { content, image } = req.body as ThreadUpdateDTO;
    const threadId = getIdParams(req, "threadId");
    await ThreadService.update(threadId, { content, image });

    return res.status(204).json(new NoContent("Thread successfully updated."));
  }
}
