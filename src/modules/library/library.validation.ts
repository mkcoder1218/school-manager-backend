import Joi from 'joi';

export const createBookSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  isbn: Joi.string().trim().required(),
  total_copies: Joi.number().integer().min(1).required(),
  available_copies: Joi.number().integer().min(0).required(),
  category: Joi.string().trim().required(),
  status: Joi.string().valid('available', 'borrowed', 'reserved').required(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().trim(),
  author: Joi.string().trim(),
  isbn: Joi.string().trim(),
  total_copies: Joi.number().integer().min(1),
  available_copies: Joi.number().integer().min(0),
  category: Joi.string().trim(),
  status: Joi.string().valid('available', 'borrowed', 'reserved'),
});

export const borrowBookSchema = Joi.object({
  book_id: Joi.string().uuid().required(),
  student_id: Joi.string().uuid().required(),
  borrow_date: Joi.date().required(),
});

export const returnBookSchema = Joi.object({
  return_date: Joi.date().max('now').required(),
});
