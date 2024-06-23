"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMethod = void 0;
exports.Method = Method;
exports.Get = Get;
exports.Put = Put;
exports.Patch = Patch;
exports.Delete = Delete;
exports.Post = Post;
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
function Get(path) {
    return Method(path, "GET");
}
function Put(path) {
    return Method(path, "PUT");
}
function Patch(path) {
    return Method(path, "PATCH");
}
function Delete(path) {
    return Method(path, "DELETE");
}
function Post(path) {
    return Method(path, "POST");
}
//# sourceMappingURL=httpMethod.js.map