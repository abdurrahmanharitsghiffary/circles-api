import { AppRequest, AppResponse } from "@/types/express";
import { Controller } from ".";
import { DecorateAll } from "@/decorators";
import { Authorize } from "@/decorators/factories/authorize";
import { getUserId } from "@/utils/getUserId";
import UserService from "@/services/user";
import { ApiPagingResponse, NoContent, Success } from "@/libs/response";
import ThreadService from "@/services/thread";
import { ReplyService } from "@/services/reply";
import { Validate } from "@/decorators/factories/validate";
import { pagingSchema } from "@/schema/paging";
import { updateUserSchema } from "@/schema/user";
import { UploadImage } from "@/decorators/factories/uploadImage";
import { omitProperties } from "@/utils/omitProperties";
import { UpdateUserDTO } from "@/types/userDto";
import { Cloudinary } from "@/utils/cloudinary";
import { genRandToken } from "@/utils/genRandToken";
import { Token, User } from "@/models";
import { ENV } from "@/config/env";
import { sendVerifyEmailLink } from "@/libs/nodemailer";
import Joi from "joi";
import { RequestError } from "@/libs/error";

@DecorateAll(Authorize())
export class MeController extends Controller {
  async index(req: AppRequest, res: AppResponse) {
    const userId = getUserId(req);
    const user = await UserService.find(userId);

    return res.json(new Success(omitProperties(user, ["isFollowed"])));
  }

  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: updateUserSchema })
  async update(req: AppRequest, res: AppResponse) {
    const userId = getUserId(req);
    const { bio, firstName, lastName, username } = req.body as UpdateUserDTO;
    let { photoProfile, coverPicture } = req.body as UpdateUserDTO;

    const uploadedImages = await Cloudinary.uploadFileFields(req);
    if (uploadedImages?.photoProfile)
      photoProfile = uploadedImages.photoProfile;
    if (uploadedImages?.coverPicture)
      coverPicture = uploadedImages.coverPicture;

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
  async threads(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
    const paginationOptions = req.pagination;
    const [threads, count] = await ThreadService.findByUserId(
      loggedUserId,
      paginationOptions,
      loggedUserId
    );

    return res.json(new ApiPagingResponse(req, threads, count));
  }

  @Validate({ query: pagingSchema })
  async replies(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
    const paginationOptions = req.pagination;
    const [replies, count] = await ReplyService.findByUserId(
      loggedUserId,
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, replies, count));
  }

  @Validate({ query: pagingSchema })
  async likes(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
    const paginationOptions = req.pagination;
    const [likedThreads, count] = await ThreadService.findLikedByUserId(
      loggedUserId,
      paginationOptions,
      loggedUserId
    );

    return res.json(new ApiPagingResponse(req, likedThreads, count));
  }

  @Validate({ query: pagingSchema })
  async followers(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
    const paginationOptions = req.pagination;
    const [followers, count] = await UserService.findFollowings(
      loggedUserId,
      loggedUserId,
      "followers",
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, followers, count));
  }

  @Validate({ query: pagingSchema })
  async following(req: AppRequest, res: AppResponse) {
    const loggedUserId = getUserId(req);
    const paginationOptions = req.pagination;
    const [following, count] = await UserService.findFollowings(
      loggedUserId,
      loggedUserId,
      "following",
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, following, count));
  }

  async requestVerify(req: AppRequest, res: AppResponse) {
    const userId = getUserId(req);

    const user = await User.findUnique({ where: { id: userId } });
    if (user.isVerified)
      throw new RequestError("Account already verified.", 400);

    const randToken = await genRandToken();

    const verifyToken = await Token.create({
      data: {
        token: randToken,
        expiresAt: 1000 * 60 * 5,
        type: "VERIFY_TOKEN",
        userId,
      },
      include: { user: { select: { email: true } } },
    });

    const verifyUrl = `${ENV.CLIENT_BASE_URL}/me/verify-account/${verifyToken.token}`;

    sendVerifyEmailLink(verifyToken.user.email, verifyUrl);

    return res.json(
      new Success(
        null,
        "If your email is valid, verification request will been sent to your email. please check your inbox and follow the instruction to verify your account."
      )
    );
  }

  @Validate({ params: Joi.object({ token: Joi.string().required() }) })
  async verifyAccount(req: AppRequest, res: AppResponse) {
    const { token } = req.params;

    const verifyToken = await Token.findUnique({
      where: { token, type: "VERIFY_TOKEN" },
    });

    if (!verifyToken) throw new RequestError("Invalid token.", 400);
    const createdAt = new Date(verifyToken.createdAt);
    const expiresAt = new Date(createdAt.getTime() + verifyToken.expiresAt);
    const isExpired = expiresAt.getTime() < Date.now();

    if (isExpired) {
      await Token.delete({ where: { id: verifyToken.id } });
      throw new RequestError(
        "Token already expired. please submit another verification request.",
        400
      );
    }

    await User.update({
      where: { id: verifyToken.userId },
      data: { isVerified: true },
    });
    await Token.deleteMany({
      where: { userId: verifyToken.userId, type: "VERIFY_TOKEN" },
    });

    return res.json(new Success(null, "Account successfully verified."));
  }
}
