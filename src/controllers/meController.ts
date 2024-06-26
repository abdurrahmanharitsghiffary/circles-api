import { AppRequest, AppResponse } from "@/types/express";
import { Authorize } from "@/decorators/factories/authorize";
import UserService from "@/services/userService";
import { ApiPagingResponse, NoContent, Success } from "@/libs/response";
import ThreadService from "@/services/threadService";
import { ReplyService } from "@/services/replyService";
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
import {
  sendSuccessfulChangePassword,
  sendSuccessfulVerifyAccount,
  sendVerifyEmailLink,
} from "@/libs/nodemailer";
import Joi from "joi";
import { RequestError } from "@/libs/error";
import { Controller } from "@/decorators/factories/controller";
import { Get, Patch, Post } from "@/decorators/factories/httpMethod";
import bcrypt from "bcrypt";
import { ChangePasswordDto } from "@/types/dto";
import { changePaswordSchema } from "@/schema/auth";

@Controller("/me")
@Authorize()
class MeController {
  @Get("/")
  async index(req: AppRequest, res: AppResponse) {
    const userId = req.userId;
    const user = await UserService.findBy("id", userId);

    return res.json(new Success(omitProperties(user, ["password"])));
  }

  @Patch("/")
  @UploadImage("fields", [
    { name: "photoProfile", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ])
  @Validate({ body: updateUserSchema })
  async update(req: AppRequest, res: AppResponse) {
    const userId = req.userId;
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

  @Get("/threads")
  @Validate({ query: pagingSchema })
  async threads(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const paginationOptions = req.pagination;
    const [threads, count] = await ThreadService.findByUserId(
      loggedUserId,
      paginationOptions,
      loggedUserId
    );

    return res.json(new ApiPagingResponse(req, threads, count));
  }

  @Get("/replies")
  @Validate({ query: pagingSchema })
  async replies(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const paginationOptions = req.pagination;
    const [replies, count] = await ReplyService.findByUserId(
      loggedUserId,
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, replies, count));
  }

  @Get("/threads/liked")
  @Validate({ query: pagingSchema })
  async likes(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const paginationOptions = req.pagination;
    const [likedThreads, count] = await ThreadService.findLikedByUserId(
      loggedUserId,
      paginationOptions,
      loggedUserId
    );

    return res.json(new ApiPagingResponse(req, likedThreads, count));
  }

  @Get("/followers")
  @Validate({ query: pagingSchema })
  async followers(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const paginationOptions = req.pagination;
    const [followers, count] = await UserService.findFollowings(
      loggedUserId,
      loggedUserId,
      "followers",
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, followers, count));
  }

  @Get("/following")
  @Validate({ query: pagingSchema })
  async following(req: AppRequest, res: AppResponse) {
    const loggedUserId = req.userId;
    const paginationOptions = req.pagination;
    const [following, count] = await UserService.findFollowings(
      loggedUserId,
      loggedUserId,
      "following",
      paginationOptions
    );

    return res.json(new ApiPagingResponse(req, following, count));
  }

  @Post("/verify-account")
  async requestVerify(req: AppRequest, res: AppResponse) {
    const userId = req.userId;

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

  @Post("/verify-account/:token")
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

    const user = await User.update({
      where: { id: verifyToken.userId },
      data: { isVerified: true },
    });
    await Token.deleteMany({
      where: { userId: verifyToken.userId, type: "VERIFY_TOKEN" },
    });
    sendSuccessfulVerifyAccount(user.email);
    return res.json(new Success(null, "Account successfully verified."));
  }

  @Patch("/change-password")
  @Validate({ body: changePaswordSchema })
  async changePassword(req: AppRequest, res: AppResponse) {
    const { currentPassword, newPassword } = req.body as ChangePasswordDto;
    const user = await User.findUnique({
      where: { id: req.userId },
      select: { email: true, password: true },
    });
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) throw new RequestError("Incorrect password.", 400);

    await UserService.update(req.userId, { password: newPassword });
    sendSuccessfulChangePassword(user.email);
    return res
      .status(204)
      .json(new NoContent("Password successfully changed."));
  }
}

export { MeController };
