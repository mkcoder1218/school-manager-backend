import Joi from 'joi';

export const createSectionSchema = Joi.object({
  class_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
});

export const updateSectionSchema = Joi.object({
  name: Joi.string().trim(),
});
