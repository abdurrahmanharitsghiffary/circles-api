import { replyController } from "@/controllers/reply";
import { replyLikeController } from "@/controllers/replyLike";
import express from "express";
const router = express.Router();

router
  .route("/threads/:id/replies")
  .get(replyController.index)
  .post(replyController.store);
router
  .route("/reply/:id")
  .get(replyController.show)
  .patch(replyController.update)
  .delete(replyController.destroy);

router.route("/reply/:id/replies").get(replyController.replies);

router
  .route("/reply/:id/likes")
  .get(replyLikeController.index)
  .post(replyLikeController.like)
  .delete(replyLikeController.unlike);

export default router;
