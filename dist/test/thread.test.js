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
const utils_1 = require("./utils");
describe("Endpoint: /threads", () => {
    describe("GET /threads", () => {
        test("token and valid query params should success", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads?offset=10", "get", true);
            expect(response.statusCode).toBe(200);
            expect(response.body.meta.offset).toBe(10);
        }));
        test("invalid query parameters should return validation error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads?offset=jajajaj&limit=kokok", "get", true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
    });
    describe("GET /threads/:id", () => {
        test("invalid params should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/jsjsjsj", "get");
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("valid params should success", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1", "get");
            expect(response.statusCode).toBe(200);
            expect(response.body.data.content).toBeDefined();
        }));
        test("should return error when thread not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/11111", "get", true);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Thread not found.");
        }));
    });
    describe("POST /threads", () => {
        test("should success store data when req.body is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads", "post", true, true).send({
                content: "loler",
            });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBeDefined();
            expect(response.body.data.id).toBeDefined();
        }));
        test("should error when creating thread with invalid value", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads", "post", true, true).send({
                content: 1,
            });
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("without token should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads", "post");
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("No token provided.");
        }));
    });
    describe("PATCH /threads/:id", () => {
        test("updating not owned thread should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/10", "patch", true, true);
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Cannot delete or modify another user thread.");
        }));
        test("should return error when params id invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/ajkodsk", "patch", true, true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("should return error when thread not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/11111111", "patch", true, true);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Thread not found.");
        }));
        test("should return error when req.body is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const response = yield (0, utils_1.request)("/threads/5", "patch", true, true).send({
                content: 1,
            });
            expect(response.statusCode).toBe(422);
            expect((_b = ((_a = response.body.errors) !== null && _a !== void 0 ? _a : [])) === null || _b === void 0 ? void 0 : _b.length).toBe(1);
        }));
        test("should success update when req.body is valid and thread found", () => __awaiter(void 0, void 0, void 0, function* () {
            const generatedContent = `${Date.now()}CONTEN`;
            const response = yield (0, utils_1.request)("/threads/5", "patch", true, true).send({
                content: generatedContent,
            });
            const response2 = yield (0, utils_1.request)("/threads/5", "get", true, true);
            expect(response2.body.data.content).toBe(generatedContent);
            expect(response.statusCode).toBe(204);
        }));
        test("without token should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1", "patch");
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("No token provided.");
        }));
    });
    describe("DELETE /threads/:id", () => {
        test("deleting not owned thread should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/10", "delete", true, true);
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Cannot delete or modify another user thread.");
        }));
        test("should return error when params id invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/ajkodsk", "delete", true, true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("should return error when thread not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/11111111", "delete", true, true);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Thread not found.");
        }));
        test("should success delete when thread found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads", "post", true, true).send({
                content: "loler thread",
            });
            const response2 = yield (0, utils_1.request)(`/threads/${response.body.data.id}`, "delete", true, true);
            expect(response2.statusCode).toBe(204);
        }));
        test("without token should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1", "delete");
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("No token provided.");
        }));
    });
    describe("GET /threads/:id/likes", () => {
        test("token and valid query params should success", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1/likes?offset=10", "get", true);
            expect(response.statusCode).toBe(200);
            expect(response.body.meta.offset).toBe(10);
        }));
        test("return error when thread not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/11111111/likes?offset=10", "get", true);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Thread not found.");
        }));
        test("invalid query parameters should return validation error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1/likes?offset=jajajaj&limit=kokok", "get", true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("invalid id params should return validation error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/akpsojapojdo/likes?offset=jajajaj&limit=kokok", "get", true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
    });
    describe("POST /threads/:id/likes", () => {
        test("Should return error when params id invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/ajkodsk/likes", "post", true, true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("should return error when thread not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/11111111/likes", "post", true, true);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Thread not found.");
        }));
        test("should success when liking thread with valid params", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/5/likes", "post", true, true);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBeDefined();
        }));
        test("without token should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1/likes", "post");
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("No token provided.");
        }));
    });
    describe("DELETE /threads/:id/likes", () => {
        test("Should return error when params id invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/ajkodsk/likes", "delete", true, true);
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("should return error when thread not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/11111111/likes", "delete", true, true);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Thread not found.");
        }));
        test("should success when liking thread with valid params", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/5/likes", "delete", true, true);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBeDefined();
        }));
        test("without token should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/threads/1/likes", "delete");
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("No token provided.");
        }));
    });
    // describe("GET /threads/:id/liked", () => {
    //   test("invalid params should return error", async () => {
    //     const response = await request("/threads/jsjsjsj", "get");
    //     expect(response.statusCode).toBe(422);
    //     expect(response.body.errors).toBeDefined();
    //   });
    //   test("valid params should success", async () => {
    //     const response = await request("/threads/1", "get");
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.data.content).toBeDefined();
    //   });
    //   test("should return error when thread not found", async () => {
    //     const response = await request("/threads/11111", "get", true);
    //     expect(response.statusCode).toBe(404);
    //     expect(response.body.message).toBe("Thread not found.");
    //   });
    //   test("without token should return error", async () => {
    //     const response = await request("/threads/1/likes", "delete");
    //     expect(response.statusCode).toBe(401);
    //     expect(response.body.message).toBe("No token provided.");
    //   });
    // });
});
//# sourceMappingURL=thread.test.js.map