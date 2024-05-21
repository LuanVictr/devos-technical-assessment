import { celebrate, Joi } from "celebrate";

const userSchema = {
  id: Joi.number(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string(),
  coordinates: Joi.array().items(
    Joi.number().required(),
    Joi.number().required()
  ),
  regions: Joi.array().items(Joi.any()),
};

const user = celebrate(
  {
    body: Joi.object({
      ...userSchema,
    }),
  },
  {
    abortEarly: true,
  }
);

export default { user };
