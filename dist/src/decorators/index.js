"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareDecorator = exports.MethodDecorator = exports.DecorateAll = void 0;
class Next extends Error {
    constructor() {
        super();
        this.name = "Next";
    }
}
/**
 * Jangan dipake kecuali pengen modif method pake method decorator
 */
function DecorateAll(decorator) {
    return function (target) {
        const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
        for (const [propName, descriptor] of Object.entries(descriptors)) {
            const isMethod = descriptor.value instanceof Function;
            if (!isMethod)
                continue;
            decorator(target, propName, descriptor);
            Object.defineProperty(target.prototype, propName, descriptor);
        }
    };
}
exports.DecorateAll = DecorateAll;
/**
 * @deprecated JANGAN PAKE INI, KALO PENGEN PAKE KENAPA HARUS YG INI!!!
 */
function MethodDecorator(cb) {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                yield cb(...args);
                yield original.call(this, ...args);
            });
        };
    };
}
exports.MethodDecorator = MethodDecorator;
/**
 * @deprecated PAKE Middleware decorator JANGAN INI!!!!!
 */
function MiddlewareDecorator(cb) {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        descriptor.value = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield cb(req, res, (err) => {
                        if (err)
                            return next(err);
                        throw new Next();
                    });
                    return;
                }
                catch (err) {
                    if (res.headersSent)
                        return;
                    if (err instanceof Next)
                        return yield original.call(this, req, res, next);
                    throw err;
                }
            });
        };
    };
}
exports.MiddlewareDecorator = MiddlewareDecorator;
//# sourceMappingURL=index.js.map