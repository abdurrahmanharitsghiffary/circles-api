import { AppRequest, AppResponse } from "@/types/express";
import UserService from "@/services/user";
import { Validate } from "@/decorators/factories/validate";
import { Authorize } from "@/decorators/factories/authorize";
import ThreadService from "@/services/thread";
import { Pagination } from "@/libs/pagination";
import { FromCache } from "@/decorators/factories/fromCache";
import { RKEY } from "@/libs/consts";
import { redisClient } from "@/libs/redisClient";
import { Controller } from "@/decorators/factories/controller";
import { Get } from "@/decorators/factories/httpMethod";
import { searchQuerySchema } from "@/schema/search";

class SampleService {
  async hello() {
    console.log("HELLO");
  }
}

@Controller("/search")
class SearchController {
  constructor(protected sampleService: SampleService) {}

  @Get("/")
  @Authorize({ isOptional: true })
  @Validate({ query: searchQuerySchema })
  @FromCache(RKEY.SEARCH)
  async handle(req: AppRequest, res: AppResponse) {
    await this.sampleService.hello();
    const { q = "", type = "all" } = req.query;
    const t = type.toString().split(",");
    const paginationOptions = req.pagination;
    const userId = req.userId;

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

export { SearchController };
