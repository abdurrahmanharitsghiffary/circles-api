import { AppRequest, AppResponse } from "@/types/express";
import { ApiResponse } from "@/libs/response";
import { Controller } from "@/decorators/factories/controller";

@Controller()
class NotFoundMiddleware {
  async handle(req: AppRequest, res: AppResponse) {
    return res.status(404).json(new ApiResponse(null, 404, "Route not found."));
  }
}

export const notFoundMiddleware = new NotFoundMiddleware();
