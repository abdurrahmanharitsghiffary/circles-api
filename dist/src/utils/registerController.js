"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
const httpMethod_1 = require("@/decorators/factories/httpMethod");
const consts_1 = require("@/libs/consts");
const tryCatch_1 = require("@/middlewares/tryCatch");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const colors = {
    GET: "cyan",
    DELETE: "red",
    POST: "yellowBright",
    PATCH: "magenta",
    PUT: "magenta",
};
function registerController(app, controllers, options) {
    let totalRoute = 0;
    controllers.forEach((controller) => {
        const descriptors = Object.getOwnPropertyDescriptors(controller.prototype);
        const baseUrl = Reflect.getMetadata(consts_1.TYPES.BASE_URL, controller) || "";
        const isController = Reflect.getMetadata(consts_1.TYPES.CONTROLLER, controller) || false;
        const routerMiddlewares = Reflect.getMetadata(consts_1.TYPES.MIDDLEWARES, controller) || [];
        console.log("Registering", chalk_1.default.magentaBright(controller.name));
        if (!isController) {
            console.log(chalk_1.default.yellow(`WARN: The ${controller === null || controller === void 0 ? void 0 : controller.name} class is not a controller and will be ignored. Use the @Controller decorator to make this class a controller.`));
            return;
        }
        const router = express_1.default.Router();
        if (routerMiddlewares.length > 0)
            router.use(routerMiddlewares.map((middleware) => (0, tryCatch_1.tryCatch)(middleware)));
        const registeredRoute = [];
        for (const [propName, descriptor] of Object.entries(descriptors)) {
            const isHandler = Reflect.getMetadata(consts_1.TYPES.HANDLER, controller.prototype, propName) ||
                false;
            const method = Reflect.getMetadata(consts_1.TYPES.HTTP_METHOD, controller.prototype, propName);
            const pathname = Reflect.getMetadata(consts_1.TYPES.ENDPOINT, controller.prototype, propName) ||
                "";
            const middlewares = Reflect.getMetadata(consts_1.TYPES.MIDDLEWARES, controller.prototype, propName) || [];
            const endpoint = path_1.default
                .join((options === null || options === void 0 ? void 0 : options.prefix) || "", baseUrl, pathname)
                .replaceAll("\\", "/");
            if (isHandler) {
                const isConflict = registeredRoute.some((r) => {
                    const sepPath = r.path.split("/");
                    const sepEp = endpoint.split("/");
                    const conflict = sepEp.every((pathname, i) => { var _a; return ((_a = sepPath[i]) === null || _a === void 0 ? void 0 : _a.includes(":")) || sepPath[i] === pathname; });
                    return (r.method === method && conflict && sepPath.length === sepEp.length);
                });
                if (options === null || options === void 0 ? void 0 : options.debug) {
                    if (isConflict) {
                        console.log(`❓ ${propName} ${chalk_1.default.yellow(endpoint)}`);
                        console.log(chalk_1.default.red(`WARNING: ${endpoint} may not be registered due to a route conflict. If you have routes like /foo/:barId and /foo/bar, ensure the controller method for /foo/bar is defined before the dynamic route /foo/:barId.`));
                    }
                    else {
                        console.log(`✅ ${propName} ${chalk_1.default.greenBright(endpoint)} ${chalk_1.default[colors[method]]("[", method, "]")}`);
                    }
                }
                router[httpMethod_1.httpMethod[method]](pathname, middlewares.map((middleware) => (0, tryCatch_1.tryCatch)(middleware)), (0, tryCatch_1.tryCatch)(descriptor.value));
                registeredRoute.push({ method, path: endpoint });
            }
            else {
                if (propName !== "constructor") {
                    console.log(`❌ ${propName} ${chalk_1.default.red(endpoint)}`);
                    console.log(chalk_1.default.yellow("WARN:", propName, "is not a handler method. This method will not be registered.", "To make this method a handler, use one of the following HTTP method decorators:", chalk_1.default[colors.GET]("@Get"), chalk_1.default[colors.POST]("@Post"), chalk_1.default[colors.PATCH]("@Patch"), chalk_1.default[colors.PUT]("@Put"), chalk_1.default[colors.DELETE]("@Delete")));
                }
            }
        }
        app.use((options === null || options === void 0 ? void 0 : options.prefix) + baseUrl, router);
        totalRoute += registeredRoute.length;
        console.log(`Total registered routes: ${registeredRoute.length}
      `);
    });
    console.log(`Total routes: ${totalRoute}
    `);
}
//# sourceMappingURL=registerController.js.map