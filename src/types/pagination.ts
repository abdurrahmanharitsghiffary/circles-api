export type PaginationBase = {
  limit: number;
  offset: number;
};

export type Pagination = {
  resultCount: number;
  totalRecords: number;
  next: string;
  currentPage: number;
  prev: string;
  totalPages: number;
  current: string;
} & PaginationBase;
