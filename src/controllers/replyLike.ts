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
import { getUserId } from "@/utils/getUserId";
import { Controller } from ".";
import { ReplyLikeService } from "@/services/replyLike";
import { ReplyService } from "@/services/reply";

export class ReplyLikeController extends Controller {
  @Validate({ query: pagingSchema, params: paramsSchema })
  async index(req: AppRequest, res: AppResponse) {
    const replyId = getParamsId(req);
    await ReplyService.find(replyId);
    const paginationOptions = req.pagination;

    const [users, count] = await ReplyLikeService.findAll(
      replyId,
      paginationOptions,
      getUserId(req)
    );

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Authorize()
  @ValidateParamsAsNumber()
  async unlike(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
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

  @Authorize()
  @ValidateParamsAsNumber()
  async like(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
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
