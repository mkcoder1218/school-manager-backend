import Joi from 'joi';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createTimetableSchema = Joi.object({
  class_id: Joi.string().uuid().required(),
  section_id: Joi.string().uuid().required(),
  subject_id: Joi.string().uuid().required(),
  teacher_id: Joi.string().uuid().required(),
  day: Joi.string()
    .valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    .required(),
  start_time: Joi.string().pattern(timePattern).required(),
  end_time: Joi.string().pattern(timePattern).required(),
});

export const updateTimetableSchema = Joi.object({
  class_id: Joi.string().uuid(),
  section_id: Joi.string().uuid(),
  subject_id: Joi.string().uuid(),
  teacher_id: Joi.string().uuid(),
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  start_time: Joi.string().pattern(timePattern),
  end_time: Joi.string().pattern(timePattern),
});
