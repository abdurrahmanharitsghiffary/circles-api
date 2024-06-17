import { AppRequest, AppResponse } from "@/types/express";
import UserService from "@/services/user";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "@/libs/response";
import { getParamsId } from "@/utils/getParamsId";
import { AdminOnly, Authorize } from "@/decorators/factories/authorize";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { createUserSchema, updateUserSchema } from "@/schema/user";
import { paramsSchema } from "@/schema";
import { UploadImage } from "@/decorators/factories/uploadImage";
import { pagingSchema } from "@/schema/paging";
import { CreateUserDTO, UpdateUserDTO } from "@/types/userDto";
import { Cloudinary } from "@/utils/cloudinary";
import { Controller } from "@/decorators/factories/controller";
import ThreadService from "@/services/thread";
import { Delete, Get, Patch, Post } from "@/decorators/factories/httpMethod";
import { BaseController } from ".";

@Controller("/users")
class UserController implements BaseController {
  @Get("/")
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema })
  async index(req: AppRequest, res: AppResponse) {
    const userId = req.userId;
    const paginationOptions = req.pagination;

    const [users, count] = await UserService.findAll(paginationOptions, userId);

    return res.status(200).json(new ApiPagingResponse(req, users, count));
  }

  @Get("/:id")
  @Authorize({ isOptional: true })
  @ValidateParamsAsNumber()
  async show(req: AppRequest, res: AppResponse) {
    const userId = getParamsId(req);
    const loggedUserId = req.userId;
    const user = await UserService.find(userId, loggedUserId);

    return res.status(200).json(new Success(user));
  }

  @Post("/")
  @Authorize()
  @AdminOnly()
  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: createUserSchema })
  async store(req: AppRequest, res: AppResponse) {
    const { email, firstName, password, username, bio, lastName } =
      req.body as CreateUserDTO;
    let { photoProfile, coverPicture } = req.body as CreateUserDTO;

    const uploadedImages = await Cloudinary.uploadFileFields(req);
    if (uploadedImages?.photoProfile)
      photoProfile = uploadedImages.photoProfile;
    if (uploadedImages?.coverPicture)
      coverPicture = uploadedImages.coverPicture;

    const createdUser = await UserService.create({
      email,
      firstName,
      password,
      bio,
      username,
      lastName,
      coverPicture,
      photoProfile,
    });

    return res
      .status(201)
      .json(new Created(createdUser, "User successfully saved."));
  }

  @Delete("/:id")
  @Authorize()
  @AdminOnly()
  @ValidateParamsAsNumber()
  async destroy(req: AppRequest, res: AppResponse) {
    const userId = getParamsId(req);
    await UserService.delete(userId);

    return res.status(204).json(new NoContent("User successfully deleted."));
  }

  @Patch("/:id")
  @Authorize()
  @AdminOnly()
  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: updateUserSchema, params: paramsSchema })
  async update(req: AppRequest, res: AppResponse) {
    const { bio, firstName, lastName, username } = req.body as UpdateUserDTO;
    let { photoProfile, coverPicture } = req.body as UpdateUserDTO;

    const uploadedImages = await Cloudinary.uploadFileFields(req);
    if (uploadedImages?.photoProfile)
      photoProfile = uploadedImages.photoProfile;
    if (uploadedImages?.coverPicture)
      coverPicture = uploadedImages.coverPicture;

    const userId = getParamsId(req);
    await UserService.update(userId, {
      bio,
      firstName,
      lastName,
      coverPicture,
      photoProfile,
      username,
    });

    return res.status(204).json(new NoContent("User successfully updated."));
  }

  @Post("/:id/follow")
  @Authorize()
  @ValidateParamsAsNumber()
  async follow(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const userId = getParamsId(req);

    const isFollowed = await UserService.follow(loggedUserId, userId);

    return res.json(
      new Success(
        null,
        isFollowed ? "User successfully followed." : "User already followed."
      )
    );
  }

  @Delete("/:id/follow")
  @Authorize()
  @ValidateParamsAsNumber()
  async unfollow(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const userId = getParamsId(req);

    const isUnfollowed = await UserService.unfollow(loggedUserId, userId);

    return res.json(
      new Success(
        null,
        isUnfollowed ? "User successfully unfollowed." : "User not followed."
      )
    );
  }

  @Get("/:id/followers")
  @Authorize()
  @Validate({ query: pagingSchema, params: paramsSchema })
  async followers(req: AppRequest, res: AppResponse) {
    const userId = getParamsId(req);
    const currentUserId = req.userId;
    await UserService.find(userId);

    const paginationOptions = req.pagination;
    const [users, count] = await UserService.findFollowings(
      userId,
      currentUserId,
      "followers",
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Get("/:id/following")
  @Authorize()
  @Validate({ query: pagingSchema, params: paramsSchema })
  async following(req: AppRequest, res: AppResponse) {
    const userId = getParamsId(req);
    const currentUserId = req.userId;
    await UserService.find(userId);

    const paginationOptions = req.pagination;
    const [users, count] = await UserService.findFollowings(
      userId,
      currentUserId,
      "following",
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Get("/:id/threads")
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema, params: paramsSchema })
  async findByUserId(req: AppRequest, res: AppResponse) {
    const paginationOptions = req.pagination;
    const userId = getParamsId(req);
    const [threads, count] = await ThreadService.findByUserId(
      userId,
      paginationOptions,
      req.userId
    );

    return res.json(new ApiPagingResponse(req, threads, count));
  }
}

export { UserController };
