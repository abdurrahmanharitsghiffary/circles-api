import { Pagination } from "./pagination";

export type Response<T> = {
  data: T;
  status: number;
  message?: string;
  success: boolean;
  meta?: Pagination;
  errors?: unknown[];
};
