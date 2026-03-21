import Joi from 'joi';

export const createExamSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  academic_year_id: Joi.string().uuid().required(),
  class_id: Joi.string().uuid().required(),
  section_id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  exam_date: Joi.date().required(),
  start_time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
  end_time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
  type: Joi.string().valid('online', 'offline').required(),
});

export const updateExamSchema = Joi.object({
  class_id: Joi.string().uuid(),
  section_id: Joi.string().uuid(),
  name: Joi.string().trim(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  exam_date: Joi.date(),
  start_time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/),
  end_time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/),
  type: Joi.string().valid('online', 'offline'),
});

export const createExamSubjectSchema = Joi.object({
  exam_id: Joi.string().uuid().required(),
  subject_id: Joi.string().uuid().required(),
  total_marks: Joi.number().positive().required(),
  passing_marks: Joi.number().min(0).required(),
});

export const createQuestionSchema = Joi.object({
  exam_subject_id: Joi.string().uuid().required(),
  question_text: Joi.string().trim().required(),
  type: Joi.string().valid('multiple_choice', 'true_false', 'short_answer', 'essay').required(),
  options: Joi.array().items(Joi.string()).allow(null),
  correct_answer: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()), Joi.boolean())
    .allow(null),
  marks: Joi.number().positive().required(),
});

export const createStudentAnswerSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  question_id: Joi.string().uuid().required(),
  answer: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()), Joi.boolean())
    .allow(null)
    .required(),
});

export const submitExamSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        question_id: Joi.string().uuid().required(),
        answer: Joi.alternatives()
          .try(Joi.string(), Joi.array().items(Joi.string()), Joi.boolean())
          .allow(null)
          .required(),
      })
    )
    .min(1)
    .required(),
});
