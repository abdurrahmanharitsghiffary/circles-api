import Joi from "joi";
import { J } from ".";
import { CreateUserDTO, UpdateUserDTO } from "@/types/userDto";

export const updateUserSchema = Joi.object<UpdateUserDTO>({
  firstName: J.firstName,
  username: J.username,
  lastName: J.lastName,
  bio: J.bio,
  photoProfile: J.photo,
  coverPicture: J.photo,
});

export const createUserSchema = Joi.object<CreateUserDTO>({
  firstName: J.firstName.required(),
  username: J.username.required(),
  coverPicture: J.photo,
  lastName: J.lastName,
  bio: J.bio,
  photoProfile: J.photo,
  email: J.email.required(),
  password: J.password.required(),
});
