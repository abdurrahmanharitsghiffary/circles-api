import { TYPES } from "@/libs/consts";
import { Constructor } from "type-fest";

export function Controller<T>(baseEndpoint: string) {
  return function (target: Constructor<T>) {
    Reflect.defineMetadata(TYPES.BASE_URL, baseEndpoint, target);
  };
}
