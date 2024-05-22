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

const region = celebrate(
  {
    body: Joi.object({
      ...regionSchema,
    }),
  },
  {
    abortEarly: true,
  }
);

export default { region };
