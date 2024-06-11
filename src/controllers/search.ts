import { Request, Response } from "express";
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

export class SearchController extends Controller {
  @Authorize({ isOptional: true })
  @Validate({
    query: pagingSchema.keys({
      q: Joi.string().optional(),
      type: Joi.string()
        .pattern(/^(all|((threads|users)(,(threads|users))*))$/)
        .messages({
          "string.pattern.base": `Value must be "all" or "threads", and "users" value except "all" can be a combination separated by commas, without duplicates or spaces. example accepted value: "all" | "threads,users" | "users"`,
        }),
    }),
  })
  async handle(req: Request, res: Response) {
    const { q = "", type = "all" } = req.query;
    const t = type.toString().split(",");
    const paging = getPagingOptions(req);
    const userId = getUserId(req);

    const data: any = {};

    if (t.includes("all") || t.includes("users")) {
      const [users, userCount] = await UserService.search(
        q.toString(),
        paging,
        userId
      );
      const userPaging = new Pagination(req, users, userCount);
      data.users = userPaging;
    }

    if (t.includes("all") || t.includes("threads")) {
      const [threads, threadCount] = await ThreadService.search(
        q.toString(),
        paging,
        userId
      );
      const threadPaging = new Pagination(req, threads, threadCount);
      data.threads = threadPaging;
    }

    return res.json({ results: data, status: 200, success: true });
  }
}
