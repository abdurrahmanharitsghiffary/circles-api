import { HTTPMethod, httpMethod } from "@/decorators/factories/httpMethod";
import { TYPES } from "@/libs/consts";
import { tryCatch } from "@/middlewares/tryCatch";
import { AppHandler } from "@/types/express";
import express from "express";
import path from "path";
import chalk from "chalk";

const colors = {
  GET: "cyan",
  DELETE: "red",
  POST: "yellowBright",
  PATCH: "magenta",
  PUT: "magenta",
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
    const isController =
      Reflect.getMetadata(TYPES.CONTROLLER, controller) || false;

    console.log("Registering", chalk.magentaBright(controller.name));
    if (!isController) {
      console.log(
        chalk.yellow(
          `WARN: The ${controller?.name} class is not a controller and will be ignored. Use the @Controller decorator to make this class a controller.`
        )
      );
      return;
    }

    const registeredRoute: { method: HTTPMethod; path: string }[] = [];

    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isHandler: boolean =
        Reflect.getMetadata(TYPES.HANDLER, controller.prototype, propName) ||
        false;

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

      if (isHandler) {
        const isConflict = registeredRoute.some((r) => {
          const sepLength = r.path.split("/").length;
          const dynamicPath = endpoint.split("/").slice(0, -1).join("/") + "/:";
          return (
            r.method === method &&
            r.path.includes(dynamicPath) &&
            sepLength === endpoint.split("/").length
          );
        });

        if (options?.debug) {
          console.log(
            `✅ ${propName} ${chalk.greenBright(endpoint)} ${chalk[
              colors[method]
            ]("[", method, "]")}`
          );

          if (isConflict)
            console.log(
              chalk.red(
                `WARNING: ${endpoint} may not be registered due to a route conflict. If you have routes like /foo/:barId and /foo/bar, ensure the controller method for /foo/bar is defined before the dynamic route /foo/:barId.`
              )
            );
        }

        app[httpMethod[method]](
          endpoint,
          middlewares.map((middleware) => tryCatch(middleware)),
          tryCatch(descriptor.value)
        );

        registeredRoute.push({ method, path: endpoint });
      } else {
        if (propName !== "constructor") {
          console.log(
            chalk.yellow(
              "WARN:",
              propName,
              "is not a handler method. This method will not be registered.",
              "To make this method a handler, use one of the following HTTP method decorators:",
              chalk[colors.GET]("@Get"),
              chalk[colors.POST]("@Post"),
              chalk[colors.PATCH]("@Patch"),
              chalk[colors.PUT]("@Put"),
              chalk[colors.DELETE]("@Delete")
            )
          );
        }
      }
    }

    console.log(`Total registered routes: ${registeredRoute.length}
      `);
  });
}
