import { request } from "./utils";

describe("Endpoint: /threads", () => {
  describe("GET /threads", () => {
    test("token and valid query params should success", async () => {
      const response = await request("/threads?offset=10", "get", true);
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(10);
    });

    test("invalid query parameters should return validation error", async () => {
      const response = await request(
        "/threads?offset=jajajaj&limit=kokok",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /threads/:id", () => {
    test("invalid params should return error", async () => {
      const response = await request("/threads/jsjsjsj", "get");
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("valid params should success", async () => {
      const response = await request("/threads/1", "get");
      expect(response.statusCode).toBe(200);
      expect(response.body.data.content).toBeDefined();
    });

    test("should return error when thread not found", async () => {
      const response = await request("/threads/11111", "get", true);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Thread not found.");
    });
  });

  describe("POST /threads", () => {
    test("should success store data when req.body is valid", async () => {
      const response = await request("/threads", "post", true, true).send({
        content: "loler",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
    });

    test("should error when creating thread with invalid value", async () => {
      const response = await request("/threads", "post", true, true).send({
        content: 1,
      });

      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/threads", "post");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("PATCH /threads/:id", () => {
    test("updating not owned thread should return error", async () => {
      const response = await request("/threads/10", "patch", true, true);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Cannot delete or modify another user thread."
      );
    });

    test("should return error when params id invalid", async () => {
      const response = await request("/threads/ajkodsk", "patch", true, true);
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when thread not found", async () => {
      const response = await request("/threads/11111111", "patch", true, true);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Thread not found.");
    });

    test("should return error when req.body is invalid", async () => {
      const response = await request("/threads/5", "patch", true, true).send({
        content: 1,
      });

      expect(response.statusCode).toBe(422);
      expect((response.body.errors ?? [])?.length).toBe(1);
    });

    test("should success update when req.body is valid and thread found", async () => {
      const generatedContent = `${Date.now()}CONTEN`;

      const response = await request("/threads/5", "patch", true, true).send({
        content: generatedContent,
      });

      const response2 = await request("/threads/5", "get", true, true);

      expect(response2.body.data.content).toBe(generatedContent);
      expect(response.statusCode).toBe(204);
    });

    test("without token should return error", async () => {
      const response = await request("/threads/1", "patch");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("DELETE /threads/:id", () => {
    test("deleting not owned thread should return error", async () => {
      const response = await request("/threads/10", "delete", true, true);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Cannot delete or modify another user thread."
      );
    });

    test("should return error when params id invalid", async () => {
      const response = await request("/threads/ajkodsk", "delete", true, true);
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when thread not found", async () => {
      const response = await request("/threads/11111111", "delete", true, true);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Thread not found.");
    });

    test("should success delete when thread found", async () => {
      const response = await request("/threads", "post", true, true).send({
        content: "loler thread",
      });

      const response2 = await request(
        `/threads/${response.body.data.id}`,
        "delete",
        true,
        true
      );
      expect(response2.statusCode).toBe(204);
    });

    test("without token should return error", async () => {
      const response = await request("/threads/1", "delete");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("GET /threads/:id/likes", () => {
    test("token and valid query params should success", async () => {
      const response = await request("/threads/1/likes?offset=10", "get", true);
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(10);
    });

    test("return error when thread not found", async () => {
      const response = await request(
        "/threads/11111111/likes?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Thread not found.");
    });

    test("invalid query parameters should return validation error", async () => {
      const response = await request(
        "/threads/1/likes?offset=jajajaj&limit=kokok",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("invalid id params should return validation error", async () => {
      const response = await request(
        "/threads/akpsojapojdo/likes?offset=jajajaj&limit=kokok",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /threads/:id/likes", () => {
    test("Should return error when params id invalid", async () => {
      const response = await request(
        "/threads/ajkodsk/likes",
        "post",
        true,
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when thread not found", async () => {
      const response = await request(
        "/threads/11111111/likes",
        "post",
        true,
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Thread not found.");
    });

    test("should success when liking thread with valid params", async () => {
      const response = await request("/threads/5/likes", "post", true, true);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/threads/1/likes", "post");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("DELETE /threads/:id/likes", () => {
    test("Should return error when params id invalid", async () => {
      const response = await request(
        "/threads/ajkodsk/likes",
        "delete",
        true,
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when thread not found", async () => {
      const response = await request(
        "/threads/11111111/likes",
        "delete",
        true,
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Thread not found.");
    });

    test("should success when liking thread with valid params", async () => {
      const response = await request("/threads/5/likes", "delete", true, true);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/threads/1/likes", "delete");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
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
