import { ENV } from "@/config/env";
import { AppRequest } from "@/types/express";
import { Pagination as PaginationT } from "@/types/pagination";
import { getPagingOptions } from "@/utils/getPagingOptions";

export class Pagination<T> implements PaginationT {
  current: string;
  hasNextPage: boolean;
  limit: number;
  next: string;
  offset: number;
  prev: string;
  resultCount: number;
  totalRecords: number;

  protected getUrl(req: AppRequest, type: "prev" | "next" | "current") {
    const { limit, offset } = getPagingOptions(req);
    const url = new URL(req.originalUrl, ENV.BASE_URL);
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

  protected getNextUrl(req: AppRequest, totalRecords: number) {
    const { limit, offset } = getPagingOptions(req);
    const url = this.getUrl(req, "next");

    if (totalRecords - offset > limit) return url.href;
    return null;
  }

  protected getPrevUrl(req: AppRequest) {
    const { limit, offset } = getPagingOptions(req);
    const url = this.getUrl(req, "prev");
    if (offset - limit > limit - limit * 2) return url.href;
    return null;
  }

  constructor(req: AppRequest, data: T[], count: number) {
    const { limit, offset } = getPagingOptions(req);
    const next = this.getNextUrl(req, count);
    const prev = this.getPrevUrl(req);
    this.current = this.getUrl(req, "current").href;
    this.hasNextPage = next !== null;
    this.limit = limit;
    this.offset = offset;
    this.next = next;
    this.prev = prev;
    this.resultCount = data?.length;
    this.totalRecords = count;
  }
}
