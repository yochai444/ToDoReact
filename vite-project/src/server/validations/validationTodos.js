import Joi from "@hapi/joi";

export const todoSchema = Joi.object({
  name: Joi.string(),
  subject: Joi.string(),
  priority: Joi.number(),
  date: Joi.date().required(),
  completed: Joi.boolean(),
});
