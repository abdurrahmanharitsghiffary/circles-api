import { $Enums } from "@prisma/client";
import { UserBaseSelectPayload } from "@/query/select/userSelect";

type Authenticated = {
  isLoggedIn?: boolean;
  user?: Omit<UserBaseSelectPayload, "bio" | "_count"> & {
    role?: $Enums.UserRole;
  };
};

declare global {
  namespace Express {
    interface Request {
      auth?: Authenticated;
      file?: Multer.File & { dataURI: string };
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
