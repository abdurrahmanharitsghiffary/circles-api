import Joi from "joi";
import { J } from ".";

export const pagingSchema = Joi.object({
  limit: J.int,
  offset: J.int,
});
