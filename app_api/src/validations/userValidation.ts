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

const userUpdateSchema = {
  id: Joi.number(),
  name: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  coordinates: Joi.array().items(
    Joi.number().required(),
    Joi.number().required()
  ),
  regions: Joi.array().items(Joi.any()),
};

const save = celebrate(
  {
    body: Joi.object({
      ...userSchema,
    }),
  },
  {
    abortEarly: true,
  }
);

const update = celebrate(
  {
    body: Joi.object({
      ...userUpdateSchema,
    }),
  },
  {
    abortEarly: true,
  }
);

export default { save, update };
