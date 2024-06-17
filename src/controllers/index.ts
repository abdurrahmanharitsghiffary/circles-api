import { AppHandler } from "@/types/express";

export abstract class BaseController {
  index?: AppHandler;
  show?: AppHandler;
  store?: AppHandler;
  update?: AppHandler;
  destroy?: AppHandler;
  handle?: AppHandler;
}
