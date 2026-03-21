import { Request, Response } from 'express';
import { createStudentAttendanceSchema, updateStudentAttendanceSchema } from './student-attendance.validation';
import {
  AttendanceExistsError,
  AttendanceNotFoundError,
  ClassNotFoundError,
  SchoolMismatchError,
  SectionMismatchError,
  SectionNotFoundError,
  StudentNotFoundError,
  studentAttendanceService,
} from './student-attendance.service';
import { CreateStudentAttendanceDTO, UpdateStudentAttendanceDTO } from './student-attendance.types';
import { Class } from '../academics/class.model';

const resolveSchoolId = (req: Request, classSchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return classSchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createStudentAttendanceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const clazz = await Class.findByPk((value as CreateStudentAttendanceDTO).class_id);
    if (!clazz) {
      res.status(400).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const attendance = await studentAttendanceService.createAttendance(
      value as CreateStudentAttendanceDTO
    );
    res.status(201).json({ message: 'Attendance recorded successfully', data: attendance });
  } catch (error) {
    if (
      error instanceof StudentNotFoundError ||
      error instanceof ClassNotFoundError ||
      error instanceof SectionNotFoundError ||
      error instanceof SectionMismatchError ||
      error instanceof SchoolMismatchError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof AttendanceExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  try {
    const items = await studentAttendanceService.listAttendance(schoolId);
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await studentAttendanceService.getAttendanceById(req.params.id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }
    if (req.user?.role !== 'super_admin') {
      const clazz = await Class.findByPk(attendance.class_id);
      if (!clazz || clazz.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    res.status(200).json({ data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateStudentAttendanceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const attendance = await studentAttendanceService.getAttendanceById(req.params.id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }

    if (req.user?.role !== 'super_admin') {
      const clazz = await Class.findByPk(attendance.class_id);
      if (!clazz || clazz.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    const updated = await studentAttendanceService.updateAttendance(
      req.params.id,
      value as UpdateStudentAttendanceDTO
    );
    res.status(200).json({ message: 'Attendance updated successfully', data: updated });
  } catch (error) {
    if (error instanceof AttendanceNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await studentAttendanceService.getAttendanceById(req.params.id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }

    if (req.user?.role !== 'super_admin') {
      const clazz = await Class.findByPk(attendance.class_id);
      if (!clazz || clazz.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    await studentAttendanceService.deleteAttendance(req.params.id);
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    if (error instanceof AttendanceNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
