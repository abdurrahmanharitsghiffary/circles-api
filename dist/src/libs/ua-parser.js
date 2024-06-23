"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uaParser = void 0;
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const uaParser = (req) => { var _a; return (0, ua_parser_js_1.default)((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a["user-agent"]); };
exports.uaParser = uaParser;
//# sourceMappingURL=ua-parser.js.map