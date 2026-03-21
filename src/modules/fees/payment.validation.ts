import Joi from 'joi';

export const recordPaymentSchema = Joi.object({
  student_fee_id: Joi.string().uuid().required(),
  amount_paid: Joi.number().positive().required(),
  payment_date: Joi.date().required(),
  payment_method: Joi.string().trim().required(),
  status: Joi.string().valid('success', 'failed', 'pending').required(),
  receipt_number: Joi.string().trim().required(),
});
