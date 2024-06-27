import Joi from "@hapi/joi";

export const todoSchema = Joi.object({
  name: Joi.string(),
  subject: Joi.string(),
  priority: Joi.number(),
  date: Joi.date().required(),
  completed: Joi.boolean(),
});

export const updateTodoSchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string(),
  subject: Joi.string(),
  priority: Joi.number(),
  date: Joi.date().required(),
  completed: Joi.boolean(),
});
