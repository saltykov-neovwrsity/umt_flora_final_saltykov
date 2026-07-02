import bouquetsService from "../services/bouquets.js";
import HttpError from "../helpers/HttpError.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAll = async (req, res) => {
  const result = await bouquetsService.getAll(req.query);
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await bouquetsService.getById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const create = async (req, res) => {
  const { title } = req.body;
  
  let { photoURL } = req.body;
  if (!photoURL) {
    const hash = crypto.createHash("md5").update(title || Date.now().toString()).digest("hex");
    photoURL = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=250`;
  }

  const result = await bouquetsService.create({
    ...req.body,
    photoURL
  });
  res.status(201).json(result);
};

const update = async (req, res) => {
  const { id } = req.params;
  const result = await bouquetsService.update(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const result = await bouquetsService.update(id, { favorite });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    throw HttpError(400, "File is missing or incorrect");
  }

  const { path: tempUpload } = req.file;

  try {
    // Завантажуємо зображення на Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(tempUpload, {
      folder: "flora",
      public_id: `bouquet_${id}_${Date.now()}`
    });

    const photoURL = cloudinaryResponse.secure_url;

    // Оновлюємо букет у базі даних
    const result = await bouquetsService.update(id, { photoURL });
    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json({ photoURL });
  } catch (error) {
    throw HttpError(500, `Cloudinary upload failed: ${error.message}`);
  } finally {
    // Завжди видаляємо тимчасовий файл з папки temp
    try {
      await fs.unlink(tempUpload);
    } catch (unlinkError) {
      console.error(`Failed to delete temp file: ${unlinkError.message}`);
    }
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  const result = await bouquetsService.remove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Delete success"
  });
};

export default {
  getAll,
  getById,
  create,
  update,
  updateFavorite,
  updatePhoto,
  remove
};
