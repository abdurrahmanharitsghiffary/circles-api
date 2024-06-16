import express from "express";
import { threadController } from "@/controllers/thread";
import { likeController } from "@/controllers/like";

const router = express.Router();

router.route("/").get(threadController.index).post(threadController.store);

router
  .route("/:id")
  .get(threadController.show)
  .patch(threadController.update)
  .delete(threadController.destroy);

router
  .route("/:id/likes")
  .get(likeController.index)
  .post(likeController.like)
  .delete(likeController.unlike);

export default router;
