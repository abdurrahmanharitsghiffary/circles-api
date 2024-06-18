import { TYPES } from "@/libs/consts";

export const httpMethod = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  PUT: "put",
  DELETE: "delete",
} as const;

export type HTTPMethod = keyof typeof httpMethod;

export function Method(path: string, method: HTTPMethod) {
  return function (
    target: object,
    propName: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(TYPES.HTTP_METHOD, method, target, propName);
    Reflect.defineMetadata(TYPES.ENDPOINT, path, target, propName);
    Reflect.defineMetadata(TYPES.HANDLER, true, target, propName);
  };
}

export function Get(path: string) {
  return Method(path, "GET");
}
export function Put(path: string) {
  return Method(path, "PUT");
}
export function Patch(path: string) {
  return Method(path, "PATCH");
}
export function Delete(path: string) {
  return Method(path, "DELETE");
}
export function Post(path: string) {
  return Method(path, "POST");
}
