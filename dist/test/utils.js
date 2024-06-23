"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwicGhvdG9Qcm9maWxlIjoiaHR0cHM6Ly9hdmF0YXJzLmV4YW1wbGUuY29tL3UvMTIzNDU2Nzg5MD92PTQiLCJmaXJzdE5hbWUiOiJJc2FiZWxsYSIsImxhc3ROYW1lIjoiV3JpZ2h0IiwidXNlcm5hbWUiOiJDaGFybGV5LVJpY2U3MjY0OCIsImlhdCI6MTcxNzI1MDU3MywiZXhwIjoxNzE3MzM2OTczfQ.ngUnrJ_i9xqPoaZALExIfQpCB02KKw_yKD3WFzpUNNs";
const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IlVTRVIiLCJwaG90b1Byb2ZpbGUiOiJodHRwczovL2F2YXRhcnMuZXhhbXBsZS5jb20vdS81Njc4OTAxMjM0P3Y9NCIsImZpcnN0TmFtZSI6IldpbGxpYW0iLCJsYXN0TmFtZSI6IkhhbGwiLCJ1c2VybmFtZSI6IkNhdGh5LUFybXN0cm9uZzcxOCIsImlhdCI6MTcxNzI1MDU0MywiZXhwIjoxNzE3MzM2OTQzfQ.pXyGC5Ag1JzOiig9QZUvgt_aAuLoFvqQzRr3jk0YfL0";
const BASE_ENDPOINT = "/api/v1";
const request = (url, method, authenticated = false, admin = false) => {
    if (authenticated)
        return (0, supertest_1.default)(app_1.default)[method](BASE_ENDPOINT + url)
            .set({ Authorization: `Bearer ${admin ? ADMIN_TOKEN : USER_TOKEN}` });
    return (0, supertest_1.default)(app_1.default)[method](BASE_ENDPOINT + url);
};
exports.request = request;
//# sourceMappingURL=utils.js.map