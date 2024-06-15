import { AppRequest, AppResponse } from "@/types/express";
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
import { UploadImage } from "@/decorators/factories/uploadImage";
import { Authorize, ThreadOwnerOnly } from "@/decorators/factories/authorize";
import { pagingSchema } from "@/schema/paging";
import { paramsSchema } from "@/schema";
import { CreateThreadDTO, UpdateThreadDTO } from "@/types/threadDto";
import { Cloudinary } from "@/utils/cloudinary";
import { FromCache } from "@/decorators/factories/fromCache";

export class ThreadController extends Controller {
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema })
  @FromCache("THREADS")
  async index(req: AppRequest, res: AppResponse) {
    const paging = getPagingOptions(req);
    const userId = getUserId(req);
    const [threads, count] = await ThreadService.findAll(paging, userId);

    return res.json({
      ...new ApiPagingResponse(req, threads, count),
      cacheKey: "THREADS",
    });
  }

  @Authorize({ isOptional: true })
  @ValidateParamsAsNumber()
  async show(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    const userId = getUserId(req);
    const thread = await ThreadService.find(threadId, userId);

    return res.json(new Success(thread));
  }

  @Authorize()
  @UploadImage("array", "images[]")
  @Validate({ body: createThreadSchema })
  async store(req: AppRequest, res: AppResponse) {
    const { content } = req.body as CreateThreadDTO;
    let { images } = req.body as CreateThreadDTO;

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
  async destroy(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    await ThreadService.delete(threadId);

    return res.status(204).json(new NoContent("Thread successfully deleted."));
  }

  @Authorize()
  @Validate({ body: updateThreadSchema, params: paramsSchema })
  @ThreadOwnerOnly()
  @UploadImage("array", "images[]")
  async update(req: AppRequest, res: AppResponse) {
    const { content } = req.body as CreateThreadDTO;
    let { images } = req.body as UpdateThreadDTO;

    const uploadedImages = await Cloudinary.uploadMultipleFiles(req);
    if (uploadedImages.length > 0) images = uploadedImages;

    const threadId = getParamsId(req);
    await ThreadService.update(threadId, { content, images });

    return res.status(204).json(new NoContent("Thread successfully updated."));
  }

  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema, params: paramsSchema })
  async findByUserId(req: AppRequest, res: AppResponse) {
    const paging = getPagingOptions(req);
    const userId = getParamsId(req);
    const [threads, count] = await ThreadService.findByUserId(
      userId,
      paging,
      getUserId(req)
    );

    return res.json(new ApiPagingResponse(req, threads, count));
  }
}
