import express from "express";
import { ReplyController } from "@/controllers/reply";
const router = express.Router();

router
  .route("/threads/:id/replies")
  .get(ReplyController.use("index"))
  .post(ReplyController.use("store"));
router
  .route("/replies/:id")
  .get(ReplyController.use("show"))
  .patch(ReplyController.use("update"))
  .delete(ReplyController.use("destroy"));

export default router;
