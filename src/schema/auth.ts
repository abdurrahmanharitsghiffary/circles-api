import Joi from "joi";
import { J } from ".";

export const signInSchema = Joi.object({
  password: Joi.string().required(),
  email: J.email.required(),
});

export const signUpSchema = signInSchema.keys({
  firstName: J.firstName.required(),
  lastName: J.lastName,
  username: J.username.required(),
});

export const resetPasswordSchema = Joi.object({
  newPassword: J.password.required(),
  confirmPassword: Joi.ref("newPassword"),
})
  .with("newPassword", "confirmPassword")
  .messages({
    "any.only": `"confirmPassword" and "newPassword" must be equals`,
  });

export const changePaswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).required(),
  newPassword: J.password.required(),
  confirmPassword: Joi.ref("newPassword"),
})
  .with("password", "confirmPassword")
  .messages({
    "any.only": `"confirmPassword" and "newPassword" must be equals`,
  });
