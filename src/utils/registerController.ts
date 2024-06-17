import { HTTPMethod, httpMethod } from "@/decorators/factories/httpMethod";
import { TYPES } from "@/libs/consts";
import { tryCatch } from "@/middlewares/tryCatch";
import { AppHandler } from "@/types/express";
import express from "express";
import path from "path";
import chalk from "chalk";

const reservedPropName = [
  "index",
  "store",
  "show",
  "update",
  "delete",
  "handle",
];

const colors = {
  GET: "green",
  DELETE: "red",
  POST: "yellow",
  PATCH: "cyan",
  PUT: "cyan",
} as const;

type RegisterControllerOptions = {
  prefix?: string;
  debug?: boolean;
};

export function registerController(
  app: typeof express.application,
  controllers: Function[],
  options?: RegisterControllerOptions
) {
  controllers.forEach((controller) => {
    const descriptors = Object.getOwnPropertyDescriptors(controller.prototype);
    const baseUrl: string =
      Reflect.getMetadata(TYPES.BASE_URL, controller) || "";
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const method: HTTPMethod = Reflect.getMetadata(
        TYPES.HTTP_METHOD,
        controller.prototype,
        propName
      );

      const pathname: string =
        Reflect.getMetadata(TYPES.ENDPOINT, controller.prototype, propName) ||
        "";

      const middlewares: AppHandler[] =
        Reflect.getMetadata(
          TYPES.MIDDLEWARES,
          controller.prototype,
          propName
        ) || [];

      const endpoint = path
        .join(options?.prefix || "", baseUrl, pathname)
        .replaceAll("\\", "/");

      // console.log(`Middlewares: ${middlewares}\n`);

      if (method) {
        if (options?.debug)
          console.log(
            `Endpoint registered: ${chalk.gray(
              "[",
              endpoint,
              "]"
            )} Method: ${chalk[colors[method]]("[", method, "]")}`
          );
        app[httpMethod[method]](
          endpoint,
          middlewares.map((middleware) => tryCatch(middleware)),
          tryCatch(descriptor.value)
        );
      }
    }
  });
}
