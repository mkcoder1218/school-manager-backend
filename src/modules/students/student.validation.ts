import Joi from 'joi';

export const createStudentSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  branch_id: Joi.string().uuid().required(),
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  gender: Joi.string().valid('male', 'female').required(),
  date_of_birth: Joi.date().required(),
  admission_number: Joi.string().trim().required(),
  phone: Joi.string().trim().allow(null, ''),
  address: Joi.string().trim().required(),
});
