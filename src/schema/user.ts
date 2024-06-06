import Joi from "joi";
import { J } from ".";
import { UserCreateDTO, UserUpdateDTO } from "../types/user-dto";

export const updateUserSchema = Joi.object<UserUpdateDTO>({
  firstName: J.firstName,
  username: J.username,
  lastName: J.lastName,
  bio: J.bio,
  photoProfile: J.photo,
  coverPicture: J.photo,
});

export const createUserSchema = Joi.object<UserCreateDTO>({
  firstName: J.firstName.required(),
  username: J.username.required(),
  coverPicture: J.photo,
  lastName: J.lastName,
  bio: J.bio,
  photoProfile: J.photo,
  email: J.email.required(),
  password: J.password.required(),
});
