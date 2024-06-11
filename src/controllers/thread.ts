import { Controller } from ".";
import { getPagingOptions } from "@/utils/getPagingOptions";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "@/libs/response";
import { getParamsId } from "@/utils/getParamsId";
import ThreadService from "@/services/thread";
import { getUserId } from "@/utils/getUserId";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { createThreadSchema, updateThreadSchema } from "@/schema/thread";
import { Request, Response } from "express";
import { UploadImage } from "@/decorators/factories/uploadImage";
import { Authorize, ThreadOwnerOnly } from "@/decorators/factories/authorize";
import { pagingSchema } from "@/schema/paging";
import { paramsSchema } from "@/schema";
import { CreateThreadDTO, UpdateThreadDTO } from "@/types/threadDto";
import { Cloudinary } from "@/utils/cloudinary";

export class ThreadController extends Controller {
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema })
  async index(req: Request, res: Response) {
    const paging = getPagingOptions(req);
    const userId = getUserId(req);
    const [threads, count] = await ThreadService.findAll(paging, userId);

    return res.json(new ApiPagingResponse(req, threads, count));
  }

  @Authorize({ isOptional: true })
  @ValidateParamsAsNumber()
  async show(req: Request, res: Response) {
    const threadId = getParamsId(req);
    const userId = getUserId(req);
    const thread = await ThreadService.find(threadId, userId);

    return res.json(new Success(thread));
  }

  @Authorize()
  @UploadImage("array", "images")
  @Validate({ body: createThreadSchema })
  async store(req: Request, res: Response) {
    let { content, images } = req.body as CreateThreadDTO;

    const uploadedImages = await Cloudinary.uploadMultipleFiles(req);
    if (uploadedImages.length > 0) images = uploadedImages;

    const userId = getUserId(req);
    const createdThread = await ThreadService.create({
      authorId: userId,
      content,
      images,
    });

    return res
      .status(201)
      .json(new Created(createdThread, "Thread successfully saved."));
  }

  @Authorize()
  @ValidateParamsAsNumber()
  @ThreadOwnerOnly()
  async destroy(req: Request, res: Response) {
    const threadId = getParamsId(req);
    await ThreadService.delete(threadId);

    return res.status(204).json(new NoContent("Thread successfully deleted."));
  }

  @Authorize()
  @Validate({ body: updateThreadSchema, params: paramsSchema })
  @ThreadOwnerOnly()
  @UploadImage("array", "images")
  async update(req: Request, res: Response) {
    let { content, images } = req.body as UpdateThreadDTO;

    const uploadedImages = await Cloudinary.uploadMultipleFiles(req);
    if (uploadedImages.length > 0) images = uploadedImages;

    const threadId = getParamsId(req);
    await ThreadService.update(threadId, { content, images });

    return res.status(204).json(new NoContent("Thread successfully updated."));
  }
}
