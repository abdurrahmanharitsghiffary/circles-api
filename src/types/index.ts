import { $Enums } from "@prisma/client";
import { UserBaseSelectPayload } from "@/query/select/userSelect";
import { PaginationBase } from "./pagination";

export type Authenticated = {
  isLoggedIn?: boolean;
  user?: Omit<UserBaseSelectPayload, "bio" | "_count"> & {
    role?: $Enums.UserRole;
  };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestedCacheKey?: string;
      auth?: Authenticated;
      file?: Multer.File & { dataURI: string };
      pagination: PaginationBase;
      files?:
        | {
            [fieldname: string]: (Express.Multer.File & { dataURI: string })[];
          }
        | (Express.Multer.File & { dataURI: string })[];
    }
  }
}

export type ExcludeTimeStamp<T> = Omit<T, "createdAt" | "updatedAt">;
export type DTO<T> = ExcludeTimeStamp<Omit<T, "id">>;
export type UpdateDTO<T> = Partial<DTO<T>>;
export type CreateDTO<T> = DTO<T>;
