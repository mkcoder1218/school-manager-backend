import Joi from 'joi';

export const createParentSchema = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  school_id: Joi.string().uuid().required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().trim().allow(null, ''),
  parent_subscription_required: Joi.boolean(),
  subscription_start_date: Joi.date().allow(null),
  subscription_end_date: Joi.date().allow(null),
  payment_status: Joi.string().valid('pending', 'paid', 'free'),
});

export const updateParentSchema = Joi.object({
  first_name: Joi.string().trim(),
  last_name: Joi.string().trim(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().trim().allow(null, ''),
  parent_subscription_required: Joi.boolean(),
  subscription_start_date: Joi.date().allow(null),
  subscription_end_date: Joi.date().allow(null),
  payment_status: Joi.string().valid('pending', 'paid', 'free'),
});
