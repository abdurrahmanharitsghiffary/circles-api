import { Pagination } from "./pagination";

export type Error = {
  message: string;
  code?: string;
};

export type Response<T> = {
  data: T;
  status: number;
  message?: string;
  success: boolean;
  meta?: Pagination;
  errors?: Error[];
};
