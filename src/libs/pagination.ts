import { ENV } from "@/config/env";
import { AppRequest } from "@/types/express";
import { Pagination as PaginationT } from "@/types/pagination";
import { omitProperties } from "@/utils/omitProperties";

export class Pagination<T> implements PaginationT {
  current: string;
  limit: number;
  next: string;
  offset: number;
  prev: string;
  totalPages: number;
  resultCount: number;
  currentPage: number;
  totalRecords: number;

  protected getUrl(req: AppRequest, type: "prev" | "next" | "current") {
    const { limit, offset } = req.pagination;
    const qs = omitProperties(req.query, ["limit", "offset"]);
    const url = new URL(req.originalUrl, ENV.BASE_URL);

    for (const [key, value] of Object.entries(qs)) {
      url.searchParams.set(key, value.toString());
    }

    if (type === "current") return url;
    let off = 0;

    if (type === "prev") {
      if (offset - limit < 0) {
        off = 0;
      } else {
        off = offset - limit;
      }
    } else if (type === "next") {
      off = offset + limit;
    }

    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", off.toString());
    return url;
  }

  protected getNextUrl(req: AppRequest) {
    const url = this.getUrl(req, "next");

    if (this.currentPage < this.totalPages) return url.href;
    return null;
  }

  protected getPrevUrl(req: AppRequest) {
    const { limit, offset } = req.pagination;
    const url = this.getUrl(req, "prev");
    if (
      offset - limit > limit - limit * 2 &&
      this.currentPage <= this.totalPages
    )
      return url.href;
    return null;
  }

  constructor(req: AppRequest, data: T[], count: number) {
    const { limit, offset } = req.pagination;
    this.current = this.getUrl(req, "current").href;
    this.limit = limit;
    this.offset = offset;
    this.currentPage = Math.floor(offset / limit) + 1;
    this.resultCount = data?.length;
    this.totalRecords = count;
    this.totalPages = Math.ceil(count / limit);
    const prev = this.getPrevUrl(req);
    const next = this.getNextUrl(req);
    this.next = next;
    this.prev = prev;
  }
}
