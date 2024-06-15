import { AppRequest } from "@/types/express";
import Joi from "joi";
import { MiddlewareDecorator } from "..";
import { J } from "@/schema";

type JoiSchema = Joi.ObjectSchema<unknown>;

type RequestSchema = {
  body?: JoiSchema;
  params?: JoiSchema;
  query?: JoiSchema;
};

const validateSchema = async (schema: RequestSchema, req: AppRequest) => {
  await Joi.object().keys(schema).validateAsync(
    {
      params: req.params,
      body: req.body,
      query: req.query,
    },
    { abortEarly: false, allowUnknown: true }
  );
};

export function Validate(schema: RequestSchema) {
  return MiddlewareDecorator(async (req, res, next) => {
    await validateSchema(schema, req);
    return next();
  });
}

export function ValidateParamsAsNumber(keys: string[] = ["id"]) {
  return MiddlewareDecorator(async (req, res, next) => {
    const schema: Record<string, Joi.Schema> = {};
    for (const key of keys) {
      schema[key] = J.id;
    }
    await validateSchema({ params: Joi.object(schema) }, req);
    return next();
  });
}
