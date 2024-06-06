import { Request, Response } from "express";
import { Controller } from ".";
import { DecorateAll } from "@/decorators";
import { Authorize } from "@/decorators/factories/authorize";
import { getUserId } from "@/utils/getUserId";
import UserService from "@/services/user";
import { ApiPagingResponse, NoContent, Success } from "@/libs/response";
import { getPagingOptions } from "@/utils/getPagingOptions";
import ThreadService from "@/services/thread";
import { ReplyService } from "@/services/reply";
import { Validate } from "@/decorators/factories/validate";
import { pagingSchema } from "@/schema/paging";
import { updateUserSchema } from "@/schema/user";
import { UserUpdateDTO } from "@/types/user-dto";
import { UploadImage } from "@/decorators/factories/uploadImage";
import { cloudinaryUpload } from "@/libs/cloudinary";
import { omitProperties } from "@/utils/omitProperties";

@DecorateAll(Authorize())
export class MeController extends Controller {
  async index(req: Request, res: Response) {
    const userId = getUserId(req);
    const user = await UserService.find(userId);
    return res.json(new Success(omitProperties(user, ["isFollowed"])));
  }

  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: updateUserSchema })
  async update(req: Request, res: Response) {
    const userId = getUserId(req);
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

    await UserService.update(userId, {
      bio,
      firstName,
      lastName,
      photoProfile,
      username,
      coverPicture,
    });

    return res
      .status(204)
      .json(new NoContent("Successfully update user informations."));
  }

  @Validate({ query: pagingSchema })
  async threads(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const paging = getPagingOptions(req);
    const [threads, count] = await ThreadService.findByUserId(
      loggedUserId,
      paging,
      loggedUserId
    );

    return res.json(new ApiPagingResponse(req, threads, count));
  }

  @Validate({ query: pagingSchema })
  async replies(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const paging = getPagingOptions(req);
    const [replies, count] = await ReplyService.findByUserId(
      loggedUserId,
      paging
    );

    return res.json(new ApiPagingResponse(req, replies, count));
  }

  @Validate({ query: pagingSchema })
  async likes(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const paging = getPagingOptions(req);
    const [likedThreads, count] = await ThreadService.findLikedByUserId(
      loggedUserId,
      paging,
      loggedUserId
    );

    return res.json(new ApiPagingResponse(req, likedThreads, count));
  }

  @Validate({ query: pagingSchema })
  async followers(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const paging = getPagingOptions(req);
    const [followers, count] = await UserService.findFollowings(
      loggedUserId,
      "followers",
      paging
    );

    return res.json(new ApiPagingResponse(req, followers, count));
  }

  @Validate({ query: pagingSchema })
  async following(req: Request, res: Response) {
    const loggedUserId = getUserId(req);
    const paging = getPagingOptions(req);
    const [following, count] = await UserService.findFollowings(
      loggedUserId,
      "following",
      paging
    );

    return res.json(new ApiPagingResponse(req, following, count));
  }
}
