import Joi from "joi";

export const createBouquetSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Missing required title field"
  }),
  description: Joi.string().required().messages({
    "any.required": "Missing required description field"
  }),
  price: Joi.number().required().min(0).messages({
    "any.required": "Missing required price field",
    "number.min": "Price cannot be negative"
  }),
  photoURL: Joi.string().uri().allow(""),
  favorite: Joi.boolean().default(false)
});

export const updateBouquetSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number().min(0).messages({
    "number.min": "Price cannot be negative"
  }),
  photoURL: Joi.string().uri().allow(""),
  favorite: Joi.boolean()
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "Missing required favorite field"
  })
});
