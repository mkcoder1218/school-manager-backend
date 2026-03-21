import Joi from 'joi';

export const createUserSchema = Joi.object({
  first_name: Joi.string().min(1).required(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().min(1).required(),
  role: Joi.string().min(1).required(),
  school_id: Joi.string().uuid().required(),
  branch_id: Joi.string().uuid().required(),
});
