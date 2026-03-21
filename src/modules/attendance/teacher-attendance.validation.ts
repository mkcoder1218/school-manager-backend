import Joi from 'joi';

export const createTeacherAttendanceSchema = Joi.object({
  teacher_id: Joi.string().uuid().required(),
  date: Joi.date().max('now').required(),
  status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
});

export const updateTeacherAttendanceSchema = Joi.object({
  status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
});
