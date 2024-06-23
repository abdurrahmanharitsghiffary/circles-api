"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const threads_1 = require("./threads");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Circle Api",
            description: "Circle App Social Media Website Api",
            version: "1.0.0",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Abdurrahman Harits",
                email: "abdmanharits@email.com",
            },
        },
        security: [{ BearerAuth: [] }],
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        tags: [
            {
                name: "Threads",
                description: "Thread CRUD Operations",
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                        },
                        username: {
                            type: "string",
                        },
                        firstName: {
                            type: "string",
                        },
                        lastName: {
                            type: "string",
                        },
                        photoProfile: {
                            type: "string",
                        },
                        coverPicture: {
                            type: "string",
                        },
                        _count: {
                            type: "object",
                            properties: {
                                followers: {
                                    type: "integer",
                                },
                                following: {
                                    type: "integer",
                                },
                            },
                        },
                    },
                },
                ValidationErrorResponse: {
                    allOf: [
                        { $ref: "#/components/schemas/Response" },
                        {
                            type: "object",
                            properties: {
                                errors: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                    },
                                },
                            },
                        },
                    ],
                },
                PagingResponse: {
                    allOf: [
                        { $ref: "#/components/schemas/Response" },
                        {
                            type: "object",
                            properties: {
                                meta: {
                                    type: "object",
                                    properties: {
                                        resultCount: { type: "integer" },
                                        totalRecords: { type: "integer" },
                                        next: { type: "string" },
                                        prev: { type: "string" },
                                        current: { type: "string" },
                                        hasNextPage: { type: "boolean" },
                                    },
                                },
                            },
                        },
                    ],
                },
                Response: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                        },
                        success: {
                            type: "boolean",
                        },
                        message: {
                            type: "string",
                        },
                    },
                },
                CreateThreadDTO: {
                    type: "object",
                    properties: {
                        content: { type: "string" },
                        images: {
                            type: "file",
                            description: "Can be a multiple files.",
                        },
                    },
                },
                Thread: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                        _count: {
                            type: "object",
                            properties: {
                                replies: {
                                    type: "integer",
                                },
                                likes: {
                                    type: "integer",
                                },
                            },
                        },
                        content: {
                            type: "string",
                        },
                        images: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                        authorId: {
                            type: "integer",
                        },
                        isLiked: {
                            type: "boolean",
                        },
                        author: { $ref: "#/components/schemas/User" },
                    },
                },
                ThreadPagingResponse: {
                    allOf: [
                        { $ref: "#/components/schemas/PagingResponse" },
                        {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Thread" },
                                },
                            },
                        },
                    ],
                },
            },
        },
        paths: Object.assign({}, threads_1.threadDocs),
    },
    apis: ["src/router/*.ts"],
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=specs.js.map