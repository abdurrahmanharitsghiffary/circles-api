"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("ts-jest");
const tsconfig_json_1 = require("./tsconfig.json");
const jestConfig = {
    preset: "ts-jest",
    moduleDirectories: ["node_modules", "./src"],
    moduleNameMapper: (0, ts_jest_1.pathsToModuleNameMapper)(tsconfig_json_1.compilerOptions.paths),
};
exports.default = jestConfig;
//# sourceMappingURL=jest.config.js.map