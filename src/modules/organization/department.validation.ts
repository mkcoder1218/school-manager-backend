import Joi from 'joi';

export const createDepartmentSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  branch_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
});

export const updateDepartmentSchema = Joi.object({
  school_id: Joi.string().uuid(),
  branch_id: Joi.string().uuid(),
  name: Joi.string().trim(),
});
