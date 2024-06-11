import express from "express";
import { ReplyController } from "@/controllers/reply";
import { ReplyLikeController } from "@/controllers/replyLike";
const router = express.Router();

router
  .route("/threads/:id/replies")
  .get(ReplyController.use("index"))
  .post(ReplyController.use("store"));
router
  .route("/reply/:id")
  .get(ReplyController.use("show"))
  .patch(ReplyController.use("update"))
  .delete(ReplyController.use("destroy"));

router.route("/reply/:id/replies").get(ReplyController.use("replies"));

router
  .route("/reply/:id/likes")
  .get(ReplyLikeController.use("index"))
  .post(ReplyLikeController.use("like"))
  .delete(ReplyLikeController.use("unlike"));

export default router;
