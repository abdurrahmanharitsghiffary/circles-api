import { Request } from "express";
import { Response } from "../types/response";
import { getPagingOptions } from "./getPagingOptions";
import { getEnv } from "./env";
import { Pagination } from "../types/pagination";

export class ApiResponse<T> implements Response<T> {
  success: boolean;
  meta?: Pagination;
  constructor(public data: T, public status: number, public message?: string) {
    this.success = status < 400;
  }
}

export class ApiPagingResponse<T> extends ApiResponse<T[]> {
  protected setPagingObject(data: Pagination) {
    this.meta = data;
    return this;
  }

  protected getUrl(req: Request, type: "prev" | "next" | "current") {
    const { limit, offset } = getPagingOptions(req);
    const url = new URL(req.originalUrl, getEnv("BASE_URL"));
    if (type === "current") return url;
    const off =
      type === "prev"
        ? offset - limit < 0
          ? 0
          : offset - limit
        : offset + limit;
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", off.toString());
    return url;
  }

  protected getNextUrl(req: Request, totalRecords: number) {
    const { limit, offset } = getPagingOptions(req);
    const url = this.getUrl(req, "next");

    if (totalRecords - offset > limit) return url.href;
    return null;
  }

  protected getPrevUrl(req: Request) {
    const { limit, offset } = getPagingOptions(req);
    const url = this.getUrl(req, "prev");
    if (offset - limit > limit - limit * 2) return url.href;
    return null;
  }

  constructor(req: Request, public data: T[], count: number) {
    super(data, 200);
    const { limit, offset } = getPagingOptions(req);
    const next = this.getNextUrl(req, count);
    const prev = this.getPrevUrl(req);
    const paginationObject: Pagination = {
      current: this.getUrl(req, "current").href,
      hasNextPage: next !== null,
      limit,
      offset,
      next,
      prev,
      resultCount: data?.length,
      totalRecords: count,
    };
    this.setPagingObject(paginationObject);
  }
}

export class NoContent<T> extends ApiResponse<T> {
  constructor(public message: string) {
    super(null, 204, message);
  }
}

export class Success<T> extends ApiResponse<T> {
  constructor(public data: T, public message?: string) {
    super(data, 200, message);
  }
}

export class Created<T> extends ApiResponse<T> {
  constructor(public data: T, public message?: string) {
    super(data, 201, message);
  }
}
