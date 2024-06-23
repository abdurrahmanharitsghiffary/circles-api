import { AppRequest, AppResponse } from "@/types/express";
import { ApiPagingResponse, Success } from "@/libs/response";
import { LikeService } from "@/services/like";
import { getParamsId } from "@/utils/getParamsId";
import { Authorize } from "@/decorators/factories/authorize";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { pagingSchema } from "@/schema/paging";
import { paramsSchema } from "@/schema";
import ThreadService from "@/services/thread";
import { Controller } from "@/decorators/factories/controller";
import { Delete, Get, Post } from "@/decorators/factories/httpMethod";

@Controller("/threads")
class LikeController {
  @Get("/:id/likes")
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema, params: paramsSchema })
  async index(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    await ThreadService.find(threadId);
    const paginationOptions = req.pagination;

    const [users, count] = await LikeService.findAll(
      threadId,
      paginationOptions,
      req.userId
    );

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Delete("/:id/likes")
  @Authorize()
  @ValidateParamsAsNumber()
  async unlike(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
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

  @Post("/:id/likes")
  @Authorize()
  @ValidateParamsAsNumber()
  async like(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
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

export { LikeController };
