import "reflect-metadata";
import { AppRequest, AppResponse } from "@/types/express";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "@/libs/response";
import { getParamsId } from "@/utils/getParamsId";
import ThreadService from "@/services/thread";
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
import { FromCache, ZFromCache } from "@/decorators/factories/fromCache";
import { RKEY, ZKEY } from "@/libs/consts";
import { Controller } from "@/decorators/factories/controller";
import { Delete, Get, Patch, Post } from "@/decorators/factories/httpMethod";
import { BaseController } from ".";

@Controller("/threads")
class ThreadController implements BaseController {
  @Get("/")
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema })
  @ZFromCache(ZKEY.THREADS)
  async index(req: AppRequest, res: AppResponse) {
    const paginationOptions = req.pagination;
    const userId = req.userId;
    const [threads, count] = await ThreadService.findAll(
      paginationOptions,
      userId
    );

    return res.json({
      ...new ApiPagingResponse(req, threads, count),
      cacheKey: ZKEY.THREADS,
      zAdd: true,
    });
  }

  @Get("/:id")
  @Authorize({ isOptional: true })
  @ValidateParamsAsNumber()
  @FromCache(RKEY.THREAD)
  async show(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    const userId = req.userId;
    const thread = await ThreadService.find(threadId, userId);

    return res.json({
      ...new Success(thread),
      cacheKey: RKEY.THREAD(req),
    });
  }

  @Post("/")
  @Authorize()
  @UploadImage("array", "images[]")
  @Validate({ body: createThreadSchema })
  async store(req: AppRequest, res: AppResponse) {
    const { content } = req.body as CreateThreadDTO;
    let { images } = req.body as CreateThreadDTO;

    const uploadedImages = await Cloudinary.uploadMultipleFiles(req);
    if (uploadedImages.length > 0) images = uploadedImages;

    const userId = req.userId;
    const createdThread = await ThreadService.create({
      authorId: userId,
      content,
      images,
    });

    return res
      .status(201)
      .json(new Created(createdThread, "Thread successfully saved."));
  }

  @Delete("/:id")
  @Authorize()
  @ValidateParamsAsNumber()
  @ThreadOwnerOnly()
  async destroy(req: AppRequest, res: AppResponse) {
    const threadId = getParamsId(req);
    await ThreadService.delete(threadId);

    return res.status(204).json(new NoContent("Thread successfully deleted."));
  }

  @Patch("/:id")
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
}

export { ThreadController };
