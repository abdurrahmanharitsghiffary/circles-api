import { AppRequest, AppResponse } from "@/types/express";
import { Controller } from ".";
import UserService from "@/services/user";
import { getPagingOptions } from "@/utils/getPagingOptions";
import { getUserId } from "@/utils/getUserId";
import { Validate } from "@/decorators/factories/validate";
import { pagingSchema } from "@/schema/paging";
import Joi from "joi";
import { Authorize } from "@/decorators/factories/authorize";
import ThreadService from "@/services/thread";
import { Pagination } from "@/libs/paging";
import { FromCache } from "@/decorators/factories/fromCache";
import { RKEY } from "@/libs/consts";
import { redisClient } from "@/libs/redisClient";

export class SearchController extends Controller {
  @Authorize({ isOptional: true })
  @FromCache(RKEY.SEARCH)
  @Validate({
    query: pagingSchema.keys({
      q: Joi.string().min(0),
      type: Joi.string()
        .pattern(/^(all|((threads|users)(,(threads|users))*))$/)
        .messages({
          "string.pattern.base": `Value must be "all" or "threads", and "users" value except "all" can be a combination separated by commas, without duplicates or spaces. example accepted value: "all" | "threads,users" | "users"`,
        })
        .optional(),
    }),
  })
  async handle(req: AppRequest, res: AppResponse) {
    const { q = "", type = "all" } = req.query;
    const t = type.toString().split(",");
    const paging = getPagingOptions(req);
    const userId = getUserId(req);

    const data: Record<string, unknown> = {};

    if (t.includes("all") || t.includes("users")) {
      const [users, userCount] = await UserService.search(
        q.toString(),
        paging,
        userId
      );
      const userPaging = new Pagination(req, users, userCount);
      data.users = {
        items: users,
        meta: userPaging,
      };
    }

    if (t.includes("all") || t.includes("threads")) {
      const [threads, threadCount] = await ThreadService.search(
        q.toString(),
        paging,
        userId
      );
      const threadPaging = new Pagination(req, threads, threadCount);
      data.threads = {
        items: threads,
        meta: threadPaging,
      };
    }

    const resJson = { results: data, status: 200, success: true };

    await redisClient.set(RKEY.SEARCH(req), JSON.stringify(resJson));

    return res.json(resJson);
  }
}
