import { Controller } from ".";
import { ThreadCreateDTO, ThreadUpdateDTO } from "@/types/thread-dto";
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
import { cloudinaryUpload } from "@/libs/cloudinary";
import { pagingSchema } from "@/schema/paging";
import { paramsSchema } from "@/schema";

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
  @UploadImage("single", "image")
  @Validate({ body: createThreadSchema })
  async store(req: Request, res: Response) {
    let { content, image } = req.body as ThreadCreateDTO;

    if (req?.file?.dataURI) {
      const uploadedImage = await cloudinaryUpload(req.file.dataURI);
      image = uploadedImage.secure_url;
    }

    const userId = getUserId(req);
    const createdThread = await ThreadService.create({
      authorId: userId,
      content,
      image,
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
  @UploadImage("single", "image")
  async update(req: Request, res: Response) {
    let { content, image } = req.body as ThreadUpdateDTO;

    if (req?.file?.dataURI) {
      const uploadedImage = await cloudinaryUpload(req.file.dataURI);
      console.log(uploadedImage.secure_url, "SECURE");
      image = uploadedImage.secure_url;
    }

    const threadId = getParamsId(req);
    await ThreadService.update(threadId, { content, image });

    return res.status(204).json(new NoContent("Thread successfully updated."));
  }
}
