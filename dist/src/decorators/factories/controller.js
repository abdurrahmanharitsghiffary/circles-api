"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = Controller;
const consts_1 = require("@/libs/consts");
function Controller(baseEndpoint) {
    return function (target) {
        Reflect.defineMetadata(consts_1.TYPES.BASE_URL, baseEndpoint, target);
        Reflect.defineMetadata(consts_1.TYPES.CONTROLLER, true, target);
    };
}
//# sourceMappingURL=controller.js.map