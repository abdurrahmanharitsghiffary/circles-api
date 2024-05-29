export type PaginationBase = {
  limit: number;
  offset: number;
};

export type Pagination = {
  resultCount: number;
  totalRecords: number;
  next: string;
  prev: string;
  current: string;
  hasNextPage: boolean;
} & PaginationBase;
