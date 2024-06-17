import Joi from "joi";
import { pagingSchema } from "./paging";

export const searchQuerySchema = pagingSchema.keys({
  q: Joi.string().min(0),
  type: Joi.string()
    .pattern(/^(all|((threads|users)(,(threads|users))*))$/)
    .messages({
      "string.pattern.base": `Value must be "all" or "threads", and "users" value except "all" can be a combination separated by commas, without duplicates or spaces. example accepted value: "all" | "threads,users" | "users"`,
    })
    .optional(),
});
