import { AppRequest, AppResponse } from "@/types/express";
import UserService from "@/services/user";
import { getUserId } from "@/utils/getUserId";
import { Validate } from "@/decorators/factories/validate";
import { pagingSchema } from "@/schema/paging";
import Joi from "joi";
import { Authorize } from "@/decorators/factories/authorize";
import ThreadService from "@/services/thread";
import { Pagination } from "@/libs/pagination";
import { FromCache } from "@/decorators/factories/fromCache";
import { RKEY } from "@/libs/consts";
import { redisClient } from "@/libs/redisClient";
import { Controller } from "@/decorators/factories/controller";

@Controller()
class SearchController {
  @Authorize({ isOptional: true })
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
  @FromCache(RKEY.SEARCH)
  async handle(req: AppRequest, res: AppResponse) {
    const { q = "", type = "all" } = req.query;
    const t = type.toString().split(",");
    const paginationOptions = req.pagination;
    const userId = getUserId(req);

    const data: Record<string, unknown> = {};

    if (t.includes("all") || t.includes("users")) {
      const [users, userCount] = await UserService.search(
        q.toString(),
        paginationOptions,
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
        paginationOptions,
        userId
      );
      const threadPaging = new Pagination(req, threads, threadCount);
      data.threads = {
        items: threads,
        meta: threadPaging,
      };
    }

    const resJson = { data, status: 200, success: true };

    await redisClient.set(RKEY.SEARCH(req), JSON.stringify(resJson));

    return res.json(resJson);
  }
}

export const searchController = new SearchController();
