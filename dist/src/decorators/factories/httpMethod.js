"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Delete = exports.Patch = exports.Put = exports.Get = exports.Method = exports.httpMethod = void 0;
const consts_1 = require("@/libs/consts");
exports.httpMethod = {
    GET: "get",
    POST: "post",
    PATCH: "patch",
    PUT: "put",
    DELETE: "delete",
};
function Method(path, method) {
    return function (target, propName, descriptor) {
        Reflect.defineMetadata(consts_1.TYPES.HTTP_METHOD, method, target, propName);
        Reflect.defineMetadata(consts_1.TYPES.ENDPOINT, path, target, propName);
        Reflect.defineMetadata(consts_1.TYPES.HANDLER, true, target, propName);
    };
}
exports.Method = Method;
function Get(path) {
    return Method(path, "GET");
}
exports.Get = Get;
function Put(path) {
    return Method(path, "PUT");
}
exports.Put = Put;
function Patch(path) {
    return Method(path, "PATCH");
}
exports.Patch = Patch;
function Delete(path) {
    return Method(path, "DELETE");
}
exports.Delete = Delete;
function Post(path) {
    return Method(path, "POST");
}
exports.Post = Post;
//# sourceMappingURL=httpMethod.js.map