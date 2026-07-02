import express from "express";
import bouquetsController from "../../controllers/bouquets.js";
import ctrlWrapper from "../../helpers/ctrlWrapper.js";
import validateBody from "../../middlewares/validateBody.js";
import isValidId from "../../middlewares/isValidId.js";
import upload from "../../middlewares/upload.js";
import {
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema
} from "../../schemas/bouquets.js";

const router = express.Router();

router.get("/", ctrlWrapper(bouquetsController.getAll));

router.get("/:id", isValidId, ctrlWrapper(bouquetsController.getById));

router.post(
  "/",
  validateBody(createBouquetSchema),
  ctrlWrapper(bouquetsController.create)
);

router.put(
  "/:id",
  isValidId,
  validateBody(updateBouquetSchema),
  ctrlWrapper(bouquetsController.update)
);

router.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrlWrapper(bouquetsController.updateFavorite)
);

router.patch(
  "/:id/photo",
  isValidId,
  upload.single("photoURL"),
  ctrlWrapper(bouquetsController.updatePhoto)
);

router.delete("/:id", isValidId, ctrlWrapper(bouquetsController.remove));

export default router;
