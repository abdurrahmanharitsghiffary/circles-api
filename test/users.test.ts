import { request } from "./utils";

describe("Endpoint: /users", () => {
  describe("GET /users", () => {
    test("token and valid query params should success", async () => {
      const response = await request("/users?offset=10", "get", true);
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(10);
    });

    test("invalid query parameters should return validation error", async () => {
      const response = await request(
        "/users?offset=jajajaj&limit=kokok",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /users/:id", () => {
    test("invalid params should return error", async () => {
      const response = await request("/users/jsjsjsj", "get", true);
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("providing token and valid params should success", async () => {
      const response = await request("/users/1", "get", true);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.username).toBeDefined();
    });

    test("should return error when user not found", async () => {
      const response = await request("/users/11111", "get", true);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });
  });

  describe("POST /users", () => {
    test("access endpoint as role USER should return forbidden status", async () => {
      const response = await request("/users", "post", true);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Only ADMIN can access this endpoint."
      );
    });

    test("should success store data when req.body is valid and user role is ADMIN", async () => {
      const response = await request("/users", "post", true, true).send({
        email: `supah${Date.now()}@gmail.com`,
        firstName: "lol",
        password: "12345678",
        username: `jajaj123423${Date.now()}`,
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
    });

    test("should error when creating user with invalid value", async () => {
      const response = await request("/users", "post", true, true).send({
        email: "supah@gm122",
        firstName: 1212,
        password: 12345678,
        username: "jajaj123",
      });

      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should error when creating user with email or username that already exists", async () => {
      const response = await request("/users", "post", true, true).send({
        email: "abdmanharits@gmail.com",
        firstName: "1212",
        password: "12345678",
        username: "jajaj123",
      });
      const response2 = await request("/users", "post", true, true).send({
        email: "uniiuhihauhsi@gmail.com",
        firstName: "1212",
        password: "12345678",
        username: "bedeul123",
      });
      expect(response.statusCode).toBe(400);
      expect(response2.statusCode).toBe(400);
      expect(response.body.message).toBe("Email already taken.");
      expect(response2.body.message).toBe("username already taken.");
    });

    test("without token should return error", async () => {
      const response = await request("/users", "post");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("PATCH /users/:id", () => {
    test("access endpoint as role USER should return forbidden status", async () => {
      const response = await request("/users/1", "patch", true);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Only ADMIN can access this endpoint."
      );
    });

    test("should return error when params id invalid", async () => {
      const response = await request("/users/ajkodsk", "patch", true, true);
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when user not found", async () => {
      const response = await request("/users/11111111", "patch", true, true);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    test("should return error when req.body is invalid", async () => {
      const response = await request("/users/10", "patch", true, true).send({
        bio: 1,
        firstName: 1,
        lastName: 1,
        photoProfile: 1,
        username: 1,
      });

      expect(response.statusCode).toBe(422);
      expect((response.body.errors ?? [])?.length).toBe(5);
    });

    test("should return error when username already taken", async () => {
      const response = await request("/users/10", "patch", true, true).send({
        username: "bedeul123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("username already taken.");
    });

    test("should success update when req.body is valid and user found", async () => {
      const generatedFN = `${Date.now()}MY_NAME`;
      const generatedLN = `${Date.now()}MY_NAME_LN`;

      const response = await request("/users/10", "patch", true, true).send({
        firstName: generatedFN,
        lastName: generatedLN,
      });

      const response2 = await request("/users/10", "get", true, true);

      expect(response2.body.data.firstName).toBe(generatedFN);
      expect(response2.body.data.lastName).toBe(generatedLN);
      expect(response.statusCode).toBe(204);
    });

    test("without token should return error", async () => {
      const response = await request("/users/1", "patch");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("DELETE /users/:id", () => {
    test("access endpoint as role USER should return forbidden status", async () => {
      const response = await request("/users/1", "delete", true);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Only ADMIN can access this endpoint."
      );
    });

    test("should return error when params id invalid", async () => {
      const response = await request("/users/ajkodsk", "delete", true, true);
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when user not found", async () => {
      const response = await request("/users/11111111", "delete", true, true);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    test("should success delete when user found", async () => {
      const response = await request("/users", "post", true, true).send({
        email: `supah${Date.now()}@gmail.com`,
        firstName: "lol",
        password: "12345678",
        username: `jajaj123423${Date.now()}`,
      });

      const response2 = await request(
        `/users/${response.body.data.id}`,
        "delete",
        true,
        true
      );
      expect(response2.statusCode).toBe(204);
    });

    test("without token should return error", async () => {
      const response = await request("/users/1", "delete");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("POST /users/:id/follow", () => {
    test("Should return error when params id invalid", async () => {
      const response = await request(
        "/users/ajkodsk/follow",
        "post",
        true,
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when user not found", async () => {
      const response = await request(
        "/users/11111111/follow",
        "post",
        true,
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    test("should success when following user with valid params", async () => {
      const response = await request("/users/5/follow", "post", true, true);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test("should success when following user with id of currently logged user", async () => {
      const response = await request("/users/1/follow", "post", true, true);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/users/1/follow", "post");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("DELETE /users/:id/follow", () => {
    test("Should return error when params id invalid", async () => {
      const response = await request(
        "/users/ajkodsk/follow",
        "delete",
        true,
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("should return error when user not found", async () => {
      const response = await request(
        "/users/11111111/follow",
        "delete",
        true,
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    test("should success when unfollowing user with valid params", async () => {
      const response = await request("/users/5/follow", "delete", true, true);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test("should success when unfollowing user with id of currently logged user", async () => {
      const response = await request("/users/1/follow", "delete", true, true);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/users/1/follow", "delete");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("GET /users/:id/followers", () => {
    test("token and valid query params should success", async () => {
      const response = await request(
        "/users/1/followers?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(10);
    });

    test("return error when id params invalid", async () => {
      const response = await request(
        "/users/asjdiajslkd/followers?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("return error when user not found", async () => {
      const response = await request(
        "/users/1111111/followers?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    test("invalid query parameters should return validation error", async () => {
      const response = await request(
        "/users/1/followers?offset=jajajaj&limit=kokok",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/users/1/followers", "get");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("GET /users/:id/following", () => {
    test("token and valid query params should success", async () => {
      const response = await request(
        "/users/1/following?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(10);
    });

    test("return error when id params invalid", async () => {
      const response = await request(
        "/users/asjdiajslkd/following?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("return error when user not found", async () => {
      const response = await request(
        "/users/1111111/following?offset=10",
        "get",
        true
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    test("invalid query parameters should return validation error", async () => {
      const response = await request(
        "/users/1/following?offset=jajajaj&limit=kokok",
        "get",
        true
      );
      expect(response.statusCode).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    test("without token should return error", async () => {
      const response = await request("/users/1/following", "get");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided.");
    });
  });
});
