import Joi from 'joi';

export const createSubjectSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
});

export const updateSubjectSchema = Joi.object({
  school_id: Joi.string().uuid(),
  name: Joi.string().trim(),
});
