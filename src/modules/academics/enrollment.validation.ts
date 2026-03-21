import Joi from 'joi';

export const createEnrollmentSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  class_id: Joi.string().uuid().required(),
  section_id: Joi.string().uuid().required(),
  academic_year_id: Joi.string().uuid().required(),
});
