import Joi from 'joi';

export const createClassSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
});

export const updateClassSchema = Joi.object({
  name: Joi.string().trim(),
});
