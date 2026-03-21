import Joi from 'joi';

export const createStudentResultSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  student_id: Joi.string().uuid().required(),
  exam_subject_id: Joi.string().uuid().required(),
  score: Joi.number().required(),
});

export const updateStudentResultSchema = Joi.object({
  school_id: Joi.string().uuid(),
  student_id: Joi.string().uuid(),
  exam_subject_id: Joi.string().uuid(),
  score: Joi.number(),
});
