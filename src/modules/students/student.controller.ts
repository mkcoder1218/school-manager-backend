import { Request, Response } from 'express';
import { createStudentSchema } from './student.validation';
import {
  AdmissionNumberExistsError,
  BranchMismatchError,
  BranchNotFoundError,
  SchoolNotFoundError,
  studentService,
} from './student.service';
import { CreateStudentDTO } from './student.types';

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createStudentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const actorSchoolId = req.user?.school_id ?? null;
  const targetSchoolId = (value as CreateStudentDTO).school_id;

  if (actorRole !== 'super_admin' && actorSchoolId !== targetSchoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const student = await studentService.createStudent(value as CreateStudentDTO);
    res.status(201).json({
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    if (
      error instanceof SchoolNotFoundError ||
      error instanceof BranchNotFoundError ||
      error instanceof BranchMismatchError ||
      error instanceof AdmissionNumberExistsError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Server error' });
  }
};
