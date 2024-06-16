import { DecorateAll } from "..";
import { TryCatch } from "./tryCatch";

export function Controller() {
  return DecorateAll(TryCatch(), ["getRouter"]);
}
