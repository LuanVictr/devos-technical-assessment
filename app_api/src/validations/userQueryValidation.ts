import { celebrate, Joi } from "celebrate";

const userQuerySchema = {
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
};

const userQuery = celebrate(
  {
    query: Joi.object({
      ...userQuerySchema,
    }),
  },
  {
    abortEarly: true,
  }
);

export default { userQuery };
