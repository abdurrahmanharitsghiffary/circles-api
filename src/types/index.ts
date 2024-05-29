import { BaseEntity } from "typeorm";

export type ExcludeEntityMethod<T> = Omit<T, keyof BaseEntity>;
export type ExcludeEntityMethodAndTimeStamp<T> = Omit<
  T,
  keyof BaseEntity | "createdAt" | "updatedAt"
>;
