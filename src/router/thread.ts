import express from "express";
import { ThreadController } from "../controllers/thread";

const router = express.Router();

router
  .route("/")
  .get(ThreadController.use("index"))
  .post(ThreadController.use("store"));

router
  .route("/:threadId")
  .get(ThreadController.use("show"))
  .patch(ThreadController.use("update"))
  .delete(ThreadController.use("destroy"));

export default router;
