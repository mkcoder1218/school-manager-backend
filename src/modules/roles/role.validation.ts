import Joi from 'joi';

export const createRoleSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('', null),
});
