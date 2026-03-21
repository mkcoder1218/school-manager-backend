import Joi from 'joi';

export const createTeacherSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  branch_id: Joi.string().uuid().allow(null),
  user_id: Joi.string().uuid().allow(null),
  employee_id: Joi.string().trim().required(),
});

export const updateTeacherSchema = Joi.object({
  school_id: Joi.string().uuid(),
  branch_id: Joi.string().uuid().allow(null),
  user_id: Joi.string().uuid().allow(null),
  employee_id: Joi.string().trim(),
});
