import Joi from "joi";
import { J } from ".";
import { CreateThreadDTO, UpdateThreadDTO } from "@/types/threadDto";

export const createThreadSchema = Joi.object<CreateThreadDTO>({
  content: J.text.required(),
  images: J.photos,
});

export const updateThreadSchema = Joi.object<UpdateThreadDTO>({
  content: J.text,
  images: J.photos,
});
