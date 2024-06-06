import { Request, Response } from "express";
import { Controller } from ".";
import { ApiPagingResponse, Success } from "@/libs/response";
import { LikeService } from "@/services/like";
import { getUserId } from "@/utils/getUserId";
import { getParamsId } from "@/utils/getParamsId";
import { Authorize } from "@/decorators/factories/authorize";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { getPagingOptions } from "@/utils/getPagingOptions";
import { pagingSchema } from "@/schema/paging";
import { paramsSchema } from "@/schema";
import ThreadService from "@/services/thread";

export class LikeController extends Controller {
  @Validate({ query: pagingSchema, params: paramsSchema })
  async index(req: Request, res: Response) {
    const threadId = getParamsId(req);
    await ThreadService.find(threadId);
    const paging = getPagingOptions(req);

    const [users, count] = await LikeService.findAll(threadId, paging);

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Authorize()
  @ValidateParamsAsNumber()
  async unlike(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const threadId = getParamsId(req);
    await ThreadService.find(threadId);
    const isDeleted = await LikeService.delete(loggedUserId, threadId);

    return res.json(
      new Success(
        null,
        isDeleted ? "Thread unliked successfully." : "Thread not liked."
      )
    );
  }

  @Authorize()
  @ValidateParamsAsNumber()
  async like(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const threadId = getParamsId(req);
    await ThreadService.find(threadId);
    const isStored = await LikeService.create(loggedUserId, threadId);

    return res.json(
      new Success(
        null,
        isStored ? "Thread successfully liked." : "Thread already liked."
      )
    );
  }
}
