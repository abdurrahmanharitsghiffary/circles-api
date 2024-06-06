import express from "express";
import { ThreadController } from "@/controllers/thread";
import { LikeController } from "@/controllers/like";

const router = express.Router();

router
  .route("/")
  .get(ThreadController.use("index"))
  .post(ThreadController.use("store"));

router
  .route("/:id")
  .get(ThreadController.use("show"))
  .patch(ThreadController.use("update"))
  .delete(ThreadController.use("destroy"));

router
  .route("/:id/likes")
  .get(LikeController.use("index"))
  .post(LikeController.use("like"))
  .delete(LikeController.use("unlike"));

export default router;
