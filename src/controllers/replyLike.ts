import { Authorize } from "@/decorators/factories/authorize";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { ApiPagingResponse, Success } from "@/libs/response";
import { paramsSchema } from "@/schema";
import { pagingSchema } from "@/schema/paging";
import { getPagingOptions } from "@/utils/getPagingOptions";
import { getParamsId } from "@/utils/getParamsId";
import { getUserId } from "@/utils/getUserId";
import { Request, Response } from "express";
import { Controller } from ".";
import { ReplyLikeService } from "@/services/replyLike";
import { ReplyService } from "@/services/reply";

export class ReplyLikeController extends Controller {
  @Validate({ query: pagingSchema, params: paramsSchema })
  async index(req: Request, res: Response) {
    const replyId = getParamsId(req);
    await ReplyService.find(replyId);
    const paging = getPagingOptions(req);

    const [users, count] = await ReplyLikeService.findAll(replyId, paging);

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Authorize()
  @ValidateParamsAsNumber()
  async unlike(req: Request, res: Response) {
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
  async like(req: Request, res: Response) {
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
