import Joi from 'joi';

export const createBranchSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
});

export const updateBranchSchema = Joi.object({
  school_id: Joi.string().uuid().optional(),
  name: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
});
