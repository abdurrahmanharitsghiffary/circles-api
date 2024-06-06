import { Request, Response } from "express";
import { Controller } from ".";
import { getPagingOptions } from "@/utils/getPagingOptions";
import { ReplyService } from "@/services/reply";
import { getParamsId } from "@/utils/getParamsId";
import ThreadService from "@/services/thread";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "../libs/response";
import { CreateReplyDTO, UpdateReplyDTO } from "../types/reply-dto";
import { getUserId } from "../utils/getUserId";
import { cloudinaryUpload } from "../libs/cloudinary";
import {
  Validate,
  ValidateParamsAsNumber,
} from "../decorators/factories/validate";
import { pagingSchema } from "../schema/paging";
import { paramsSchema } from "../schema";
import { Authorize, ReplyOwnerOnly } from "../decorators/factories/authorize";
import { createReplySchema, updateReplySchema } from "../schema/reply";
import { UploadImage } from "../decorators/factories/uploadImage";

export class ReplyController extends Controller {
  @Validate({ query: pagingSchema, params: paramsSchema })
  async index(req: Request, res: Response) {
    const threadId = getParamsId(req);
    const { limit, offset } = getPagingOptions(req);
    await ThreadService.find(threadId);

    const [replies, count] = await ReplyService.findAll(threadId, {
      limit,
      offset,
    });
    return res.json(new ApiPagingResponse(req, replies, count));
  }

  @ValidateParamsAsNumber()
  async show(req: Request, res: Response) {
    const replyId = getParamsId(req);
    const reply = await ReplyService.find(replyId);

    return res.json(new Success(reply));
  }

  @Authorize()
  @UploadImage("single", "image")
  @Validate({ body: createReplySchema, params: paramsSchema })
  async store(req: Request, res: Response) {
    const threadId = getParamsId(req);
    const loggerUserId = getUserId(req);
    let { content, image } = req.body as CreateReplyDTO;

    if (req?.file?.dataURI) {
      const uploadedImage = await cloudinaryUpload(req.file.dataURI);
      image = uploadedImage.secure_url;
    }

    const createdReply = await ReplyService.create({
      authorId: loggerUserId,
      content,
      image,
      threadId,
    });

    return res
      .status(201)
      .json(new Created(createdReply, "Successfully create reply."));
  }

  @Authorize()
  @ReplyOwnerOnly()
  @UploadImage("single", "image")
  @Validate({ body: updateReplySchema, params: paramsSchema })
  async update(req: Request, res: Response) {
    const replyId = getParamsId(req);
    let { content, image } = req.body as UpdateReplyDTO;

    if (req?.file?.dataURI) {
      const uploadedImage = await cloudinaryUpload(req.file.dataURI);
      image = uploadedImage.secure_url;
    }

    await ReplyService.update(replyId, { content, image });

    return res.status(204).json(new NoContent("Reply successfully updated."));
  }

  @Authorize()
  @ReplyOwnerOnly()
  @ValidateParamsAsNumber()
  async destroy(req: Request, res: Response) {
    const replyId = getParamsId(req);

    await ReplyService.delete(replyId);
    return res.status(204).json(new NoContent("Reply successfully deleted."));
  }
}
