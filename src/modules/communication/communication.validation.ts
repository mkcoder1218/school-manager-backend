import Joi from 'joi';

export const createAnnouncementSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  title: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  target_role: Joi.string().trim().allow(null, ''),
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim(),
  message: Joi.string().trim(),
  target_role: Joi.string().trim().allow(null, ''),
});

export const createMessageSchema = Joi.object({
  receiver_id: Joi.string().uuid().required(),
  message: Joi.string().trim().required(),
});
