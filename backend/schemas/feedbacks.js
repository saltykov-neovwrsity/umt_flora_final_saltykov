import Joi from "joi";

export const createFeedbackSchema = Joi.object({
  author: Joi.string().required().messages({
    "any.required": "Missing required author field"
  }),
  text: Joi.string().required().messages({
    "any.required": "Missing required text field"
  })
});
