import { AppRequest, AppResponse } from "@/types/express";
import { ReplyService } from "@/services/reply";
import { getParamsId } from "@/utils/getParamsId";
import ThreadService from "@/services/thread";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "../libs/response";
import { CreateReplyDTO, UpdateReplyDTO } from "../types/replyDto";
import {
  Validate,
  ValidateParamsAsNumber,
} from "../decorators/factories/validate";
import { pagingSchema } from "../schema/paging";
import { paramsSchema } from "../schema";
import { Authorize, ReplyOwnerOnly } from "../decorators/factories/authorize";
import { createReplySchema, updateReplySchema } from "../schema/reply";
import { UploadImage } from "../decorators/factories/uploadImage";
import { Cloudinary } from "@/utils/cloudinary";
import { Controller } from "@/decorators/factories/controller";
import { Delete, Get, Patch, Post } from "@/decorators/factories/httpMethod";
import { BaseController } from ".";

@Controller("/")
class ReplyController implements BaseController {
  @Get("/threads/:id/replies")
  @Validate({ query: pagingSchema, params: paramsSchema })
  @Authorize({ isOptional: true })
  async index(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    const { limit, offset } = req.pagination;
    await ThreadService.find(threadId);

    const [replies, count] = await ReplyService.findAll(
      threadId,
      {
        limit,
        offset,
      },
      req.userId
    );
    return res.json(new ApiPagingResponse(req, replies, count));
  }

  @Get("/reply/:id/replies")
  @Validate({ query: pagingSchema, params: paramsSchema })
  @Authorize({ isOptional: true })
  async replies(req: AppRequest, res: AppResponse) {
    const replyId = getParamsId(req);
    const { limit, offset } = req.pagination;
    await ReplyService.find(replyId);

    const [replies, count] = await ReplyService.findAllByParent(
      replyId,
      {
        limit,
        offset,
      },
      req.userId
    );
    return res.json(new ApiPagingResponse(req, replies, count));
  }

  @Get("/reply/:id")
  @ValidateParamsAsNumber()
  @Authorize({ isOptional: true })
  async show(req: AppRequest, res: AppResponse) {
    const replyId = getParamsId(req);
    const reply = await ReplyService.find(replyId, req.userId);

    return res.json(new Success(reply));
  }

  @Post("/threads/:id/replies")
  @Authorize()
  @UploadImage("single", "image")
  @Validate({ body: createReplySchema, params: paramsSchema })
  async store(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    const loggerUserId = req.userId;
    const { content, parentId } = req.body as CreateReplyDTO;
    let { image } = req.body as CreateReplyDTO;

    const uploadedImages = await Cloudinary.uploadSingleFile(req);
    if (uploadedImages) image = uploadedImages;

    const createdReply = await ReplyService.create({
      authorId: loggerUserId,
      content,
      image,
      threadId,
      parentId: Number(parentId),
    });

    return res
      .status(201)
      .json(new Created(createdReply, "Successfully create reply."));
  }

  @Patch("/reply/:id")
  @Authorize()
  @ReplyOwnerOnly()
  @UploadImage("single", "image")
  @Validate({ body: updateReplySchema, params: paramsSchema })
  async update(req: AppRequest, res: AppResponse) {
    const replyId = getParamsId(req);
    const { content } = req.body as UpdateReplyDTO;
    let { image } = req.body as UpdateReplyDTO;

    const uploadedImages = await Cloudinary.uploadSingleFile(req);
    if (uploadedImages) image = uploadedImages;

    await ReplyService.update(replyId, { content, image });

    return res.status(204).json(new NoContent("Reply successfully updated."));
  }

  @Delete("/reply/:id")
  @Authorize()
  @ReplyOwnerOnly()
  @ValidateParamsAsNumber()
  async destroy(req: AppRequest, res: AppResponse) {
    const replyId = getParamsId(req);

    await ReplyService.delete(replyId);
    return res.status(204).json(new NoContent("Reply successfully deleted."));
  }
}

export { ReplyController };
