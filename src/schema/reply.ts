import Joi from "joi";
import { J } from ".";
import { CreateReplyDTO, UpdateReplyDTO } from "@/types/replyDto";

export const createReplySchema = Joi.object<CreateReplyDTO>({
  content: J.text.required(),
  image: J.photo,
});

export const updateReplySchema = Joi.object<UpdateReplyDTO>({
  content: J.text,
  image: J.photo,
});
