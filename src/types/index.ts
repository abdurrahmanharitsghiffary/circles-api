import { BaseEntity } from "typeorm";

export type ExcludeEntityMethod<T> = Omit<T, keyof BaseEntity>;
export type ExcludeEntityMethodAndTimeStamp<T> = Omit<
  T,
  keyof BaseEntity | "createdAt" | "updatedAt"
>;

export type DTO<T> = ExcludeEntityMethodAndTimeStamp<Omit<T, "id">>;

export type UpdateDTO<T> = Partial<DTO<T>>;
export type CreateDTO<T> = DTO<T>;
