import Joi from 'joi';

export const createSchoolSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  owner: Joi.object({
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).required(),
  create_default_branch: Joi.boolean().optional(),
  default_branch_name: Joi.string().trim().allow('').optional(),
  branch_count: Joi.number().integer().min(1).max(20).optional(),
});

export const updateSchoolSchema = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().email(),
  phone: Joi.string().trim(),
  address: Joi.string().trim(),
  subscription_status: Joi.string().trim(),
});
