export const threadDocs = {
  "/api/v1/threads": {
    get: {
      summary: "Lists all the threads",
      tags: ["Threads"],
      responses: {
        "200": {
          description: "The list of the threads",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ThreadPagingResponse",
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Create a new thread",
      tags: ["Threads"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateThreadDTO",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "The created thread.",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Thread",
                      },
                    },
                  },
                  { $ref: "#/components/schemas/Response" },
                ],
              },
            },
          },
        },
        "422": {
          description: "Validation error.",
        },
      },
    },
  },
  "/api/v1/threads/{id}": {
    get: {
      summary: "Get thread by id",
      tags: ["Threads"],
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            type: "string",
          },
          required: true,
          description: "The thread id",
        },
      ],
      responses: {
        "200": {
          description: "The thread response by id",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Thread",
              },
            },
          },
        },
        "404": {
          description: "The thread was not found",
        },
        "422": {
          description: "Thread id is not a number",
        },
      },
    },
    put: {
      summary: "Update the thread by the id",
      tags: ["Threads"],
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            type: "string",
          },
          required: true,
          description: "The thread id",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Thread",
            },
          },
        },
      },
      responses: {
        "204": {
          description: "The thread was updated",
        },
        "404": {
          description: "The thread was not found",
        },
        "422": {
          description: "Thread id is not a number",
        },
      },
    },
    delete: {
      summary: "Delete the thread by id",
      tags: ["Threads"],
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            type: "string",
          },
          required: true,
          description: "The thread id",
        },
      ],
      responses: {
        "200": {
          description: "The thread was deleted",
        },
        "404": {
          description: "The thread was not found",
        },
        "422": {
          description: "Thread id is not a number",
        },
      },
    },
  },
};
