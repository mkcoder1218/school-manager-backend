import { Request, Response } from 'express';
import { createEnrollmentSchema } from './enrollment.validation';
import {
  AcademicYearNotFoundError,
  ClassNotFoundError,
  EnrollmentConflictError,
  EnrollmentNotFoundError,
  SchoolMismatchError,
  SectionMismatchError,
  SectionNotFoundError,
  StudentNotFoundError,
  enrollmentService,
} from './enrollment.service';
import { CreateEnrollmentDTO } from './enrollment.types';
import { Class } from './class.model';

const resolveSchoolId = (req: Request, classSchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return classSchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createEnrollment = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createEnrollmentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const clazz = await Class.findByPk((value as CreateEnrollmentDTO).class_id);
    if (!clazz) {
      res.status(400).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const enrollment = await enrollmentService.createEnrollment(value as CreateEnrollmentDTO);
    res.status(201).json({ message: 'Enrollment created successfully', data: enrollment });
  } catch (error) {
    if (
      error instanceof StudentNotFoundError ||
      error instanceof ClassNotFoundError ||
      error instanceof SectionNotFoundError ||
      error instanceof AcademicYearNotFoundError ||
      error instanceof SchoolMismatchError ||
      error instanceof SectionMismatchError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof EnrollmentConflictError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listEnrollments = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  try {
    const enrollments = await enrollmentService.listEnrollments(schoolId);
    res.status(200).json({ data: enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEnrollment = async (req: Request, res: Response): Promise<void> => {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
    if (!enrollment) {
      res.status(404).json({ message: 'Enrollment not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, enrollment.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && enrollment.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEnrollment = async (req: Request, res: Response): Promise<void> => {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
    if (!enrollment) {
      res.status(404).json({ message: 'Enrollment not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, enrollment.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && enrollment.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await enrollmentService.deleteEnrollment(req.params.id);
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    if (error instanceof EnrollmentNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
