import { AppRequest, AppResponse } from "@/types/express";
import { Controller } from "@/controllers";
import { ApiResponse } from "@/libs/response";

export class NotFoundMiddleware extends Controller {
  async handle(req: AppRequest, res: AppResponse) {
    return res.status(404).json(new ApiResponse(null, 404, "Route not found."));
  }
}