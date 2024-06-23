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
describe("Endpoint: /auth", () => {
    describe("POST /auth/sign-in", () => {
        test("Login with invalid password will return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-in", "post").send({
                password: "1234567",
                confirmPassword: "1234567",
                email: "abdmanharits@gmail.com",
            });
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("Login with invalid email will return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-in", "post").send({
                password: "12345678",
                confirmPassword: "12345678",
                email: "abdmanharits@gil.cocock",
            });
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("Login with not same confirmPassword return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-in", "post").send({
                password: "12345678",
                confirmPassword: "12345677",
                email: "abdmanharits@gmail.com",
            });
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("Login wrong password should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-in", "post").send({
                password: "12345677",
                confirmPassword: "12345677",
                email: "abdmanharits@gmail.com",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Invalid Credentials.");
        }));
        test("Login wrong email should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-in", "post").send({
                password: "12345678",
                confirmPassword: "12345678",
                email: "abdmanharits2121@gmail.com",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Invalid Credentials.");
        }));
        test("Login with correct email and password should return token", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-in", "post").send({
                password: "12345678",
                confirmPassword: "12345678",
                email: "abdmanharits@gmail.com",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body.data.token).toBeDefined();
        }));
    });
    describe("POST /auth/sign-up", () => {
        test("Sign up without required values should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-up", "post");
            expect(response.statusCode).toBe(422);
            expect(response.body.errors.length).toBe(4);
        }));
        test("Sign up with invalid email and password should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-up", "post").send({
                password: "1234567",
                firstName: "jamal",
                lastName: "Juki",
                username: "cocok123",
                confirmPassword: "1234567",
                email: "abdmanharits1212@gimik.c",
            });
            expect(response.statusCode).toBe(422);
            expect(response.body.errors.length).toBe(2);
        }));
        test("Sign up with not same password and confirmPassword should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-up", "post").send({
                password: "12345679",
                firstName: "jamal",
                lastName: "Juki",
                username: "cocok123",
                confirmPassword: "12345678",
                email: "abdmanharits1212@gmail.com",
            });
            expect(response.statusCode).toBe(422);
            expect(response.body.errors).toBeDefined();
        }));
        test("Sign up with email that already used should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-up", "post").send({
                password: "12345678",
                firstName: "jamal",
                lastName: "Juki",
                username: "cocok123",
                confirmPassword: "12345678",
                email: "abdmanharits@gmail.com",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Email already taken.");
        }));
        test("Sign up with username that already used should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, utils_1.request)("/auth/sign-up", "post").send({
                password: "12345678",
                firstName: "jamal",
                lastName: "Juki",
                username: "bedeul123",
                confirmPassword: "12345678",
                email: "abdmanharitssasasa@gmail.com",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("username already taken.");
        }));
        test("Successfull sign up should return token", () => __awaiter(void 0, void 0, void 0, function* () {
            const genEmail = `mail${Date.now()}@gmail.com`;
            const genUsername = `username${Date.now()}-12`;
            const response = yield (0, utils_1.request)("/auth/sign-up", "post").send({
                password: "12345678",
                firstName: "JAMAL",
                lastName: "SUKI",
                username: genUsername,
                confirmPassword: "12345678",
                email: genEmail,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body.data.token).toBeDefined();
        }));
    });
});
//# sourceMappingURL=auth.test.js.map