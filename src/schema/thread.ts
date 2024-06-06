import Joi from "joi";
import { J } from ".";

export const createThreadSchema = Joi.object({
  content: J.text.required(),
  image: J.photo,
});

export const updateThreadSchema = Joi.object({
  content: J.text,
  image: J.photo,
});
