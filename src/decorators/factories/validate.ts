import Joi from "joi";
import { MethodDecorator } from "..";
import { Request, Response } from "express";
import { J } from "@/schema";

type JoiSchema = Joi.ObjectSchema<any>;

type RequestSchema = {
  body?: JoiSchema;
  params?: JoiSchema;
  query?: JoiSchema;
};

const validateSchema = async (schema: RequestSchema, req: Request) => {
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
  return MethodDecorator(async (req: Request, res: Response) => {
    await validateSchema(schema, req);
  });
}

export function ValidateParamsAsNumber(keys: string[] = ["id"]) {
  return MethodDecorator(async (req: Request, res: Response) => {
    const schema: Record<string, Joi.Schema> = {};
    for (const key of keys) {
      schema[key] = J.id;
    }
    await validateSchema({ params: Joi.object(schema) }, req);
  });
}
