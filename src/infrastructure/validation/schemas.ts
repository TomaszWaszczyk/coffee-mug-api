import { celebrate, Joi, Segments } from "celebrate";

export const productValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(50).required(),
    price: Joi.number().min(0.01).required(),
    stock: Joi.number().min(0).default(0),
    category: Joi.string().valid("coffee", "mug", "accessories").messages({
      "any.only": "Category must be one of: coffee, mug, accessories",
      "string.base": "Category must be a string",
    }),
  }),
});

export const restockValidation = celebrate({
  [Segments.BODY]: Joi.object({
    quantity: Joi.number().min(1).required(),
  }),
});

export const sellValidation = celebrate({
  [Segments.BODY]: Joi.object({
    quantity: Joi.number().min(1).required(),
  }),
});
