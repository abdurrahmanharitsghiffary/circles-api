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
  let totalRoute = 0;
  controllers.forEach((controller) => {
    const descriptors = Object.getOwnPropertyDescriptors(controller.prototype);
    const baseUrl: string =
      Reflect.getMetadata(TYPES.BASE_URL, controller) || "";
    const isController =
      Reflect.getMetadata(TYPES.CONTROLLER, controller) || false;
    const routerMiddlewares: AppHandler[] =
      Reflect.getMetadata(TYPES.MIDDLEWARES, controller) || [];

    console.log("Registering", chalk.magentaBright(controller.name));
    if (!isController) {
      console.log(
        chalk.yellow(
          `WARN: The ${controller?.name} class is not a controller and will be ignored. Use the @Controller decorator to make this class a controller.`
        )
      );
      return;
    }

    const router = express.Router();

    if (routerMiddlewares.length > 0)
      router.use(routerMiddlewares.map((middleware) => tryCatch(middleware)));

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
          const sepPath = r.path.split("/");
          const sepEp = endpoint.split("/");

          const conflict = sepEp.every(
            (pathname, i) =>
              sepPath[i]?.includes(":") || sepPath[i] === pathname
          );
          return (
            r.method === method && conflict && sepPath.length === sepEp.length
          );
        });

        if (options?.debug) {
          if (isConflict) {
            console.log(`❓ ${propName} ${chalk.yellow(endpoint)}`);
            console.log(
              chalk.red(
                `WARNING: ${endpoint} may not be registered due to a route conflict. If you have routes like /foo/:barId and /foo/bar, ensure the controller method for /foo/bar is defined before the dynamic route /foo/:barId.`
              )
            );
          } else {
            console.log(
              `✅ ${propName} ${chalk.greenBright(endpoint)} ${chalk[
                colors[method]
              ]("[", method, "]")}`
            );
          }
        }

        router[httpMethod[method]](
          pathname,
          middlewares.map((middleware) => tryCatch(middleware)),
          tryCatch(descriptor.value)
        );

        registeredRoute.push({ method, path: endpoint });
      } else {
        if (propName !== "constructor") {
          console.log(`❌ ${propName} ${chalk.red(endpoint)}`);
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

    app.use(options?.prefix + baseUrl, router);
    totalRoute += registeredRoute.length;
    console.log(`Total registered routes: ${registeredRoute.length}
      `);
  });
  console.log(`Total routes: ${totalRoute}
    `);
}
