import Joi from 'joi';

export const createStudentAttendanceSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  class_id: Joi.string().uuid().required(),
  section_id: Joi.string().uuid().required(),
  date: Joi.date().max('now').required(),
  status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
});

export const updateStudentAttendanceSchema = Joi.object({
  status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
});
