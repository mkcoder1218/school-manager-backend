import Joi from 'joi';

export const createPermissionSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('', null),
});
