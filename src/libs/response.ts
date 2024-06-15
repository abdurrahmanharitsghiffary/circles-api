import { Response } from "@/types/response";
import { Pagination as PaginationT } from "@/types/pagination";
import { Pagination } from "./paging";
import { AppRequest } from "@/types/express";

export class ApiResponse<T> implements Response<T> {
  success: boolean;
  meta?: PaginationT;
  constructor(
    public data: T,
    public status: number,
    public message?: string,
    public name?: string,
    public errors?: unknown[]
  ) {
    this.success = status < 400;
  }
}

export class ApiPagingResponse<T> extends ApiResponse<T[]> {
  protected setPagingObject(data: PaginationT) {
    this.meta = data;
    return this;
  }

  constructor(req: AppRequest, public data: T[], count: number) {
    super(data, 200);

    this.setPagingObject(new Pagination(req, data, count));
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
