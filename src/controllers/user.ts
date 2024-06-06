import { Request, Response } from "express";
import { Controller } from ".";
import UserService from "@/services/user";
import { getPagingOptions } from "@/utils/getPagingOptions";
import {
  ApiPagingResponse,
  Created,
  NoContent,
  Success,
} from "@/libs/response";
import { getParamsId } from "@/utils/getParamsId";
import { UserCreateDTO, UserUpdateDTO } from "@/types/user-dto";
import { AdminOnly, Authorize } from "@/decorators/factories/authorize";
import {
  Validate,
  ValidateParamsAsNumber,
} from "@/decorators/factories/validate";
import { createUserSchema, updateUserSchema } from "@/schema/user";
import { paramsSchema } from "@/schema";
import { UploadImage } from "@/decorators/factories/uploadImage";
import { getUserId } from "@/utils/getUserId";
import { pagingSchema } from "@/schema/paging";
import { cloudinaryUpload } from "@/libs/cloudinary";

export class UserController extends Controller {
  @Authorize({ isOptional: true })
  @Validate({ query: pagingSchema })
  async index(req: Request, res: Response) {
    const userId = getUserId(req);
    const paging = getPagingOptions(req);

    const [users, count] = await UserService.findAll(paging, userId);

    return res.status(200).json(new ApiPagingResponse(req, users, count));
  }

  @Authorize({ isOptional: true })
  @ValidateParamsAsNumber()
  async show(req: Request, res: Response) {
    const userId = getParamsId(req);
    const loggedUserId = getUserId(req);
    const user = await UserService.find(userId, loggedUserId);

    return res.status(200).json(new Success(user));
  }

  @Authorize()
  @AdminOnly()
  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: createUserSchema })
  async store(req: Request, res: Response) {
    let {
      email,
      firstName,
      password,
      username,
      bio,
      lastName,
      photoProfile,
      coverPicture,
    } = req.body as UserCreateDTO;

    if (req.files instanceof Array === false) {
      const photoProfileDataURI = req.files?.photoProfile?.[0]?.dataURI;
      const coverPictureDataURI = req.files?.coverPicture?.[0]?.dataURI;

      if (photoProfileDataURI) {
        const uploadedImage = await cloudinaryUpload(photoProfileDataURI);
        photoProfile = uploadedImage.secure_url;
      }
      if (coverPictureDataURI) {
        const uploadedImage = await cloudinaryUpload(coverPictureDataURI);
        coverPicture = uploadedImage.secure_url;
      }
    }

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

  @Authorize()
  @AdminOnly()
  @ValidateParamsAsNumber()
  async destroy(req: Request, res: Response) {
    const userId = getParamsId(req);
    await UserService.delete(userId);

    return res.status(204).json(new NoContent("User successfully deleted."));
  }

  @Authorize()
  @AdminOnly()
  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: updateUserSchema, params: paramsSchema })
  async update(req: Request, res: Response) {
    let { bio, firstName, lastName, photoProfile, username, coverPicture } =
      req.body as UserUpdateDTO;

    if (req.files instanceof Array === false) {
      const photoProfileDataURI = req.files?.photoProfile?.[0]?.dataURI;
      const coverPictureDataURI = req.files?.coverPicture?.[0]?.dataURI;

      if (photoProfileDataURI) {
        const uploadedImage = await cloudinaryUpload(photoProfileDataURI);
        photoProfile = uploadedImage.secure_url;
      }
      if (coverPictureDataURI) {
        const uploadedImage = await cloudinaryUpload(coverPictureDataURI);
        coverPicture = uploadedImage.secure_url;
      }
    }

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

  @Authorize()
  @ValidateParamsAsNumber()
  async follow(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const userId = getParamsId(req);

    const isFollowed = await UserService.follow(loggedUserId, userId);

    return res.json(
      new Success(
        null,
        isFollowed ? "User successfully followed." : "User already followed."
      )
    );
  }

  @Authorize()
  @ValidateParamsAsNumber()
  async unfollow(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const userId = getParamsId(req);

    const isUnfollowed = await UserService.unfollow(loggedUserId, userId);

    return res.json(
      new Success(
        null,
        isUnfollowed ? "User successfully unfollowed." : "User not followed."
      )
    );
  }

  @Authorize()
  @Validate({ query: pagingSchema, params: paramsSchema })
  async followers(req: Request, res: Response) {
    const userId = getParamsId(req);
    await UserService.find(userId);
    const paging = getPagingOptions(req);
    const [users, count] = await UserService.findFollowings(
      userId,
      "followers",
      paging
    );

    return res.json(new ApiPagingResponse(req, users, count));
  }

  @Authorize()
  @Validate({ query: pagingSchema, params: paramsSchema })
  async following(req: Request, res: Response) {
    const userId = getParamsId(req);
    await UserService.find(userId);
    const paging = getPagingOptions(req);
    const [users, count] = await UserService.findFollowings(
      userId,
      "following",
      paging
    );

    return res.json(new ApiPagingResponse(req, users, count));
  }
}
