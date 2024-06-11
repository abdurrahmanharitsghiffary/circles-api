import Joi from "joi";
import { J } from ".";

export const signInSchema = Joi.object({
  password: J.password.required(),
  confirmPassword: Joi.ref("password"),
  email: J.email.required(),
})
  .with("password", "confirmPassword")
  .messages({ "any.only": `"confirmPassword" and "password" must be equals` });

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
