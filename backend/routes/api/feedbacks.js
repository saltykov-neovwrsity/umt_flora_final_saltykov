import express from "express";
import feedbacksController from "../../controllers/feedbacks.js";
import ctrlWrapper from "../../helpers/ctrlWrapper.js";
import validateBody from "../../middlewares/validateBody.js";
import { createFeedbackSchema } from "../../schemas/feedbacks.js";

const router = express.Router();

router.get("/", ctrlWrapper(feedbacksController.getAll));

router.post(
  "/",
  validateBody(createFeedbackSchema),
  ctrlWrapper(feedbacksController.create)
);

export default router;
