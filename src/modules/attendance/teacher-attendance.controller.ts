import { Request, Response } from 'express';
import { createTeacherAttendanceSchema, updateTeacherAttendanceSchema } from './teacher-attendance.validation';
import {
  AttendanceExistsError,
  AttendanceNotFoundError,
  TeacherNotFoundError,
  teacherAttendanceService,
} from './teacher-attendance.service';
import { CreateTeacherAttendanceDTO, UpdateTeacherAttendanceDTO } from './teacher-attendance.types';
import { Teacher } from '../teachers/teacher.model';

const resolveSchoolId = (req: Request): string | null => {
  if (req.user?.role === 'super_admin') {
    return (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

const resolveTeacherId = async (req: Request, bodyTeacherId?: string): Promise<string | null> => {
  if (req.user?.role === 'teacher') {
    const teacher = await Teacher.findOne({ where: { user_id: req.user?.user_id } });
    return teacher ? teacher.id : null;
  }
  return bodyTeacherId ?? null;
};

export const createTeacherAttendance = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createTeacherAttendanceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }

    const teacherId = await resolveTeacherId(req, (value as CreateTeacherAttendanceDTO).teacher_id);
    if (!teacherId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (req.user?.role !== 'super_admin') {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher || teacher.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    const attendance = await teacherAttendanceService.createAttendance({
      ...(value as CreateTeacherAttendanceDTO),
      teacher_id: teacherId,
    });
    res.status(201).json({ message: 'Attendance recorded successfully', data: attendance });
  } catch (error) {
    if (error instanceof TeacherNotFoundError) {
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

export const listTeacherAttendance = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  try {
    const items = await teacherAttendanceService.listAttendance(schoolId);
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeacherAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await teacherAttendanceService.getAttendanceById(req.params.id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }

    if (req.user?.role === 'teacher') {
      const teacherId = await resolveTeacherId(req);
      if (!teacherId || attendance.teacher_id !== teacherId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    if (req.user?.role !== 'super_admin' && req.user?.role !== 'teacher') {
      const teacher = await Teacher.findByPk(attendance.teacher_id);
      if (!teacher || teacher.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    res.status(200).json({ data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTeacherAttendance = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateTeacherAttendanceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const attendance = await teacherAttendanceService.getAttendanceById(req.params.id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }

    if (req.user?.role === 'teacher') {
      const teacherId = await resolveTeacherId(req);
      if (!teacherId || attendance.teacher_id !== teacherId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    if (req.user?.role !== 'super_admin' && req.user?.role !== 'teacher') {
      const teacher = await Teacher.findByPk(attendance.teacher_id);
      if (!teacher || teacher.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    const updated = await teacherAttendanceService.updateAttendance(
      req.params.id,
      value as UpdateTeacherAttendanceDTO
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

export const deleteTeacherAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await teacherAttendanceService.getAttendanceById(req.params.id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance not found' });
      return;
    }

    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      res.status(400).json({ message: 'school_id is required' });
      return;
    }

    if (req.user?.role === 'teacher') {
      const teacherId = await resolveTeacherId(req);
      if (!teacherId || attendance.teacher_id !== teacherId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    if (req.user?.role !== 'super_admin' && req.user?.role !== 'teacher') {
      const teacher = await Teacher.findByPk(attendance.teacher_id);
      if (!teacher || teacher.school_id !== schoolId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    await teacherAttendanceService.deleteAttendance(req.params.id);
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    if (error instanceof AttendanceNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
