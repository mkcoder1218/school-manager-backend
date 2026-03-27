import Joi from 'joi';

export const createDocumentSchema = Joi.object({
  ownerType: Joi.string().valid('student', 'teacher').required(),
  ownerId: Joi.string().uuid().required(),
  type: Joi.string().valid('id_card', 'certificate', 'cv', 'license', 'medical', 'other').required(),
  fileUrl: Joi.string().trim().uri().allow('', null),
  fileName: Joi.string().trim().max(512).allow('', null),
});

