import { AppRequest, AppResponse } from "@/types/express";
import { Authorize } from "@/decorators/factories/authorize";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { ApiPagingResponse, Success } from "@/libs/response";
import { paramsSchema } from "@/schema";
import { pagingSchema } from "@/schema/paging";
import { getParamsId } from "@/utils/getParamsId";
import { ReplyLikeService } from "@/services/replyLikeService";
import { ReplyService } from "@/services/replyService";
import { Controller } from "@/decorators/factories/controller";
import { Delete, Get, Post } from "@/decorators/factories/httpMethod";

@Controller("/reply")
class ReplyLikeController {
  @Get("/:id/likes")
  @Validate({ query: pagingSchema, params: paramsSchema })
  @Authorize({ isOptional: true })
  async index(req: AppRequest, res: AppResponse) {
    const replyId = getParamsId(req);
    await ReplyService.find(replyId);
    const paginationOptions = req.pagination;

    const [users, count] = await ReplyLikeService.findAll(
      replyId,
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
    const replyId = getParamsId(req);
    await ReplyService.find(replyId);
    const isDeleted = await ReplyLikeService.delete(loggedUserId, replyId);

    return res.json(
      new Success(
        null,
        isDeleted ? "Reply unliked successfully." : "Reply not liked."
      )
    );
  }

  @Post("/:id/likes")
  @Authorize()
  @ValidateParamsAsNumber()
  async like(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const replyId = getParamsId(req);
    await ReplyService.find(replyId);
    const isStored = await ReplyLikeService.create(loggedUserId, replyId);

    return res.json(
      new Success(
        null,
        isStored ? "Reply successfully liked." : "Reply already liked."
      )
    );
  }
}

export { ReplyLikeController };
