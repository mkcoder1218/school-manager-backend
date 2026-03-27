import Joi from 'joi';

const dateOnly = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/);

export const createParentSchema = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  school_id: Joi.string().uuid().required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().trim().min(7).max(32).required(),
  alternative_phone: Joi.string().trim().min(7).max(32).allow(null, ''),
  address: Joi.string().trim().required(),
  occupation: Joi.string().trim().allow(null, ''),
  employer: Joi.string().trim().allow(null, ''),
  parent_subscription_required: Joi.boolean(),
  subscription_start_date: dateOnly.allow(null, ''),
  subscription_end_date: dateOnly.allow(null, ''),
  payment_status: Joi.string().valid('pending', 'paid', 'free'),
});

export const updateParentSchema = Joi.object({
  first_name: Joi.string().trim(),
  last_name: Joi.string().trim(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().trim().min(7).max(32),
  alternative_phone: Joi.string().trim().min(7).max(32).allow(null, ''),
  address: Joi.string().trim(),
  occupation: Joi.string().trim().allow(null, ''),
  employer: Joi.string().trim().allow(null, ''),
  parent_subscription_required: Joi.boolean(),
  subscription_start_date: dateOnly.allow(null, ''),
  subscription_end_date: dateOnly.allow(null, ''),
  payment_status: Joi.string().valid('pending', 'paid', 'free'),
});
