import { Request, Response } from 'express';
import { createStudentSchema, registerStudentSchema } from './student.validation';
import {
  AdmissionNumberExistsError,
  BranchMismatchError,
  BranchNotFoundError,
  SchoolNotFoundError,
  StudentAccountEmailExistsError,
  StudentIdExistsError,
  StudentRoleNotFoundError,
  studentService,
} from './student.service';
import { CreateStudentDTO, RegisterStudentPayload } from './student.types';

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

export const registerStudent = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = registerStudentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const bodySchoolId = (value as RegisterStudentPayload).school_id || null;
  const bodyBranchId = (value as RegisterStudentPayload).branch_id || null;

  const schoolId = actorRole === 'super_admin' ? bodySchoolId : (req.user?.school_id ?? null);

  if (!schoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  if (!actorRole) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const payload = value as RegisterStudentPayload;
    if (payload.account && !(payload.account.email ?? payload.student.email)) {
      res.status(400).json({ message: 'Account email is required (or provide student.email)' });
      return;
    }

    const branchId = actorRole === 'super_admin' ? bodyBranchId : null;
    const result = await studentService.registerStudent(payload, { schoolId, branchId });
    res.status(201).json({ message: 'Student registered successfully', data: result });
  } catch (e) {
    if (
      e instanceof SchoolNotFoundError ||
      e instanceof BranchNotFoundError ||
      e instanceof BranchMismatchError ||
      e instanceof AdmissionNumberExistsError ||
      e instanceof StudentIdExistsError ||
      e instanceof StudentAccountEmailExistsError ||
      e instanceof StudentRoleNotFoundError
    ) {
      res.status(400).json({ message: e.message });
      return;
    }

    res.status(500).json({ message: 'Server error' });
  }
};
