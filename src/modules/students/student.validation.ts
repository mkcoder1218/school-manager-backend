import Joi from 'joi';

const dateOnly = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/);

export const createStudentSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  branch_id: Joi.string().uuid().required(),
  student_id: Joi.string().trim().min(2).max(64).required(),
  first_name: Joi.string().trim().required(),
  middle_name: Joi.string().trim().allow('', null),
  last_name: Joi.string().trim().required(),
  gender: Joi.string().valid('male', 'female').required(),
  date_of_birth: dateOnly.required(),
  admission_number: Joi.string().trim().max(64).allow('', null),
  phone: Joi.string().trim().max(32).allow(null, ''),
  email: Joi.string().trim().email().max(320).allow('', null),
  address: Joi.string().trim().required(),
  grade: Joi.string().trim().required(),
  section: Joi.string().trim().required(),
  academic_year: Joi.string().trim().required(),
  enrollment_date: dateOnly.required(),
  status: Joi.string().valid('active', 'inactive', 'graduated', 'transferred').required(),
  nationality: Joi.string().trim().allow('', null),
  place_of_birth: Joi.string().trim().allow('', null),
  blood_group: Joi.string().trim().max(8).allow('', null),
  medical_conditions: Joi.string().trim().allow('', null),
  allergies: Joi.string().trim().allow('', null),
});

export const registerStudentSchema = Joi.object({
  school_id: Joi.string().uuid().allow(null, ''),
  branch_id: Joi.string().uuid().allow(null, ''),
  student: Joi.object({
    firstName: Joi.string().trim().required(),
    middleName: Joi.string().trim().allow('', null),
    lastName: Joi.string().trim().required(),

    gender: Joi.string().valid('male', 'female').required(),
    dateOfBirth: dateOnly.required(),

    studentId: Joi.string().trim().min(2).max(64).required(),
    admissionNumber: Joi.string().trim().max(64).allow('', null),

    phone: Joi.string().trim().max(32).allow('', null),
    email: Joi.string().trim().email().max(320).allow('', null),
    address: Joi.string().trim().required(),

    grade: Joi.string().trim().required(),
    section: Joi.string().trim().required(),
    academicYear: Joi.string().trim().required(),
    enrollmentDate: dateOnly.required(),

    status: Joi.string().valid('active', 'inactive', 'graduated', 'transferred').required(),

    nationality: Joi.string().trim().allow('', null),
    placeOfBirth: Joi.string().trim().allow('', null),

    bloodGroup: Joi.string().trim().max(8).allow('', null),
    medicalConditions: Joi.string().trim().allow('', null),
    allergies: Joi.string().trim().allow('', null),
  }).required(),
  account: Joi.object({
    email: Joi.string().trim().email().max(320).allow('', null),
    password: Joi.string().min(6).max(255).required(),
  }).allow(null),
  parents: Joi.array()
    .items(
      Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),

        phone: Joi.string().trim().min(7).max(32).required(),
        alternativePhone: Joi.string().trim().min(7).max(32).allow('', null),
        email: Joi.string().trim().email().max(320).allow('', null),

        address: Joi.string().trim().required(),

        occupation: Joi.string().trim().allow('', null),
        employer: Joi.string().trim().allow('', null),

        relationship: Joi.string().valid('father', 'mother', 'guardian', 'other').required(),
        isPrimaryContact: Joi.boolean().required(),
        isEmergencyContact: Joi.boolean().required(),
      })
    )
    .min(1)
    .required(),
});
