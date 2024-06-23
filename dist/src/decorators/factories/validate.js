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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = Validate;
exports.ValidateParamsAsNumber = ValidateParamsAsNumber;
const joi_1 = __importDefault(require("joi"));
const schema_1 = require("@/schema");
const middleware_1 = require("./middleware");
const validateSchema = (schema, req) => __awaiter(void 0, void 0, void 0, function* () {
    yield joi_1.default.object().keys(schema).validateAsync({
        params: req.params,
        body: req.body,
        query: req.query,
    }, { abortEarly: false, allowUnknown: true });
});
function Validate(schema) {
    return (0, middleware_1.Middleware)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        yield validateSchema(schema, req);
        return next();
    }));
}
function ValidateParamsAsNumber(keys = ["id"]) {
    return (0, middleware_1.Middleware)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const schema = {};
        for (const key of keys) {
            schema[key] = schema_1.J.id;
        }
        yield validateSchema({ params: joi_1.default.object(schema) }, req);
        return next();
    }));
}
//# sourceMappingURL=validate.js.map