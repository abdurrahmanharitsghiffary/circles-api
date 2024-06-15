import express from "express";
import { UserController } from "@/controllers/user";
import { ThreadController } from "@/controllers/thread";

const router = express.Router();

router
  .route("/")
  .get(UserController.use("index"))
  .post(UserController.use("store"));

router
  .route("/:id")
  .get(UserController.use("show"))
  .patch(UserController.use("update"))
  .delete(UserController.use("destroy"));

router.route("/:id/threads").get(ThreadController.use("findByUserId"));

router
  .route("/:id/follow")
  .post(UserController.use("follow"))
  .delete(UserController.use("unfollow"));

router.route("/:id/followers").get(UserController.use("followers"));
router.route("/:id/following").get(UserController.use("following"));

export default router;
