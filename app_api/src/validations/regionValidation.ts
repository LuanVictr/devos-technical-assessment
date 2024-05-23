import { celebrate, Joi } from "celebrate";

const regionSchema = {
  name: Joi.string().required(),
  region: Joi.object({
    type: Joi.string().required(),
    coordinates: Joi.array()
      .items(
        Joi.array()
          .items(
            Joi.array()
              .items(Joi.number().required(), Joi.number().required())
              .required()
          )
          .required()
      )
      .required(),
  }).required(),
};

const regionUpdateSchema = {
  name: Joi.string(),
  user: Joi.string(),
  region: Joi.object({
    type: Joi.string().required(),
    coordinates: Joi.array()
      .items(
        Joi.array()
          .items(
            Joi.array()
              .items(Joi.number().required(), Joi.number().required())
              .required()
          )
          .required()
      )
      .required(),
  }),
};

const save = celebrate(
  {
    body: Joi.object({
      ...regionSchema,
    }),
  },
  {
    abortEarly: true,
  }
);

const update = celebrate(
  {
    body: Joi.object({
      ...regionUpdateSchema,
    }),
  },
  {
    abortEarly: true,
  }
);

export default { save, update };
