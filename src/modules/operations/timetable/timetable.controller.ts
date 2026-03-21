import { Request, Response } from 'express';
import { createTimetableSchema, updateTimetableSchema } from './timetable.validation';
import {
  ClassNotFoundError,
  SchoolMismatchError,
  SectionMismatchError,
  SectionNotFoundError,
  SubjectNotFoundError,
  TeacherNotFoundError,
  TimetableConflictError,
  TimetableNotFoundError,
  timetableService,
} from './timetable.service';
import { CreateTimetableDTO, UpdateTimetableDTO } from './timetable.types';
import { Class } from '../../academics/class.model';

const resolveSchoolId = (req: Request, classSchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return classSchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

const validateTimeRange = (start: string, end: string): boolean => start < end;

export const createTimetable = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createTimetableSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const dto = value as CreateTimetableDTO;
  if (!validateTimeRange(dto.start_time, dto.end_time)) {
    res.status(400).json({ message: 'start_time must be before end_time' });
    return;
  }

  try {
    const clazz = await Class.findByPk(dto.class_id);
    if (!clazz) {
      res.status(400).json({ message: 'Class not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, clazz.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && clazz.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const entry = await timetableService.createTimetable(dto);
    res.status(201).json({ message: 'Timetable created successfully', data: entry });
  } catch (error) {
    if (
      error instanceof ClassNotFoundError ||
      error instanceof SectionNotFoundError ||
      error instanceof SubjectNotFoundError ||
      error instanceof TeacherNotFoundError ||
      error instanceof SectionMismatchError ||
      error instanceof SchoolMismatchError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof TimetableConflictError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listTimetable = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  try {
    const items = await timetableService.listTimetable(schoolId, {
      class_id: req.query.class_id as string | undefined,
      section_id: req.query.section_id as string | undefined,
      teacher_id: req.query.teacher_id as string | undefined,
    });
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await timetableService.getTimetableById(req.params.id);
    if (!entry) {
      res.status(404).json({ message: 'Timetable entry not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, entry.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && entry.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTimetable = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateTimetableSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const dto = value as UpdateTimetableDTO;
  if (dto.start_time && dto.end_time && !validateTimeRange(dto.start_time, dto.end_time)) {
    res.status(400).json({ message: 'start_time must be before end_time' });
    return;
  }

  try {
    const entry = await timetableService.getTimetableById(req.params.id);
    if (!entry) {
      res.status(404).json({ message: 'Timetable entry not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, entry.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && entry.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await timetableService.updateTimetable(req.params.id, dto);
    res.status(200).json({ message: 'Timetable updated successfully', data: updated });
  } catch (error) {
    if (
      error instanceof ClassNotFoundError ||
      error instanceof SectionNotFoundError ||
      error instanceof SubjectNotFoundError ||
      error instanceof TeacherNotFoundError ||
      error instanceof SectionMismatchError ||
      error instanceof SchoolMismatchError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof TimetableConflictError) {
      res.status(409).json({ message: error.message });
      return;
    }
    if (error instanceof TimetableNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await timetableService.getTimetableById(req.params.id);
    if (!entry) {
      res.status(404).json({ message: 'Timetable entry not found' });
      return;
    }

    const schoolId = resolveSchoolId(req, entry.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && entry.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await timetableService.deleteTimetable(req.params.id);
    res.status(200).json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    if (error instanceof TimetableNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
