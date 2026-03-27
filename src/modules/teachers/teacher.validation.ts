import Joi from 'joi';

const documentSchema = Joi.object({
  type: Joi.string().valid('id_card', 'certificate', 'cv', 'license', 'medical', 'other').required(),
  fileUrl: Joi.string().trim().uri().required(),
  fileName: Joi.string().trim().max(512).allow('', null),
});

export const createTeacherSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  branch_id: Joi.string().uuid().allow(null),
  user_id: Joi.string().uuid().allow(null),
  employee_id: Joi.string().trim().required(),
  documents: Joi.array()
    .items(documentSchema)
    .min(1)
    .required()
    .custom((docs, helpers) => {
      const types = new Set((docs as Array<{ type: string }>).map((d) => d.type));
      if (!types.has('id_card') || !types.has('certificate')) {
        return helpers.error('teacher.documents');
      }
      return docs;
    }, 'teacher documents requirements'),
}).messages({
  'teacher.documents': 'Teacher must include at least 1 id_card and 1 certificate',
});

export const updateTeacherSchema = Joi.object({
  school_id: Joi.string().uuid(),
  branch_id: Joi.string().uuid().allow(null),
  user_id: Joi.string().uuid().allow(null),
  employee_id: Joi.string().trim(),
});
