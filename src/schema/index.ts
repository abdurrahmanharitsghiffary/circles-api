import Joi from "joi";

export const J = {
  id: Joi.number().positive().integer().required(),
  int: Joi.number().integer(),
  firstName: Joi.string().min(1).max(150),
  lastName: Joi.string().min(1).max(150),
  username: Joi.string().min(2),
  password: Joi.string().min(8).max(30),
  confirmPassword: Joi.ref("password"),
  email: Joi.string().email(),
  bio: Joi.string(),
  photo: Joi.string().uri(),
  text: Joi.string().min(1),
};

export const paramsSchema = Joi.object({ id: J.id });
