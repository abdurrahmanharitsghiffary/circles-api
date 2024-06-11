import express from "express";
import { MeController } from "@/controllers/me";

const router = express.Router();

router
  .route("/")
  .get(MeController.use("index"))
  .patch(MeController.use("update"));

router.route("/followers").get(MeController.use("followers"));
router.route("/threads").get(MeController.use("threads"));
router.route("/threads/liked").get(MeController.use("likes"));
router.route("/following").get(MeController.use("following"));
router.route("/replies").get(MeController.use("replies"));
router.route("/verify-account").post(MeController.use("requestVerify"));
router.route("/verify-account/:token").post(MeController.use("verifyAccount"));

export default router;
