"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const consts_1 = require("@/libs/consts");
function Middleware(middleware) {
    return function (...args) {
        if (args.length === 3) {
            const [target, propName] = args;
            const middlewares = Reflect.getMetadata(consts_1.TYPES.MIDDLEWARES, target, propName) || [];
            middlewares.unshift(middleware);
            Reflect.defineMetadata(consts_1.TYPES.MIDDLEWARES, middlewares, target, propName);
        }
        else if (args.length === 1) {
            const [target] = args;
            const middlewares = Reflect.getMetadata(consts_1.TYPES.MIDDLEWARES, target) || [];
            middlewares.unshift(middleware);
            Reflect.defineMetadata(consts_1.TYPES.MIDDLEWARES, middlewares, target);
        }
    };
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map