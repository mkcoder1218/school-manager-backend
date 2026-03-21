import Joi from 'joi';

export const createFeeSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().allow('', null),
});

export const updateFeeSchema = Joi.object({
  name: Joi.string().trim(),
  amount: Joi.number().positive(),
  description: Joi.string().allow('', null),
});

export const assignStudentFeeSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  fee_id: Joi.string().uuid().required(),
  due_date: Joi.date().required(),
});

export const updateStudentFeeSchema = Joi.object({
  status: Joi.string().valid('pending', 'paid', 'overdue').required(),
});
