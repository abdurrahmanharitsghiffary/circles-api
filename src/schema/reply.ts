import Joi from "joi";
import { J } from ".";

export const createReplySchema = Joi.object({
  content: J.text.required(),
  image: J.photo,
});

export const updateReplySchema = Joi.object({
  content: J.text,
  image: J.photo,
});
