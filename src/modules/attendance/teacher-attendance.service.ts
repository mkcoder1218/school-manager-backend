import { TeacherAttendance } from './teacher-attendance.model';
import { Teacher } from '../teachers/teacher.model';
import { generateUuid } from '../../core/utils/uuid';
import {
  CreateTeacherAttendanceDTO,
  TeacherAttendanceResponse,
  UpdateTeacherAttendanceDTO,
} from './teacher-attendance.types';

export class TeacherNotFoundError extends Error {
  constructor() {
    super('Teacher not found');
  }
}

export class AttendanceExistsError extends Error {
  constructor() {
    super('Attendance already recorded for this teacher');
  }
}

export class AttendanceNotFoundError extends Error {
  constructor() {
    super('Attendance not found');
  }
}

export const teacherAttendanceService = {
  async createAttendance(
    input: CreateTeacherAttendanceDTO
  ): Promise<TeacherAttendanceResponse> {
    const teacher = await Teacher.findByPk(input.teacher_id);
    if (!teacher) {
      throw new TeacherNotFoundError();
    }

    const existing = await TeacherAttendance.findOne({
      where: { teacher_id: input.teacher_id, date: input.date },
    });
    if (existing) {
      throw new AttendanceExistsError();
    }

    const attendance = await TeacherAttendance.create({
      id: generateUuid(),
      school_id: teacher.school_id,
      teacher_id: input.teacher_id,
      date: input.date,
      status: input.status,
    });

    return {
      id: attendance.id,
      teacher_id: attendance.teacher_id,
      date: attendance.date,
      status: attendance.status,
    };
  },

  async listAttendance(schoolId: string): Promise<TeacherAttendanceResponse[]> {
    const items = await TeacherAttendance.findAll({ where: { school_id: schoolId } });
    return items.map((item) => ({
      id: item.id,
      teacher_id: item.teacher_id,
      date: item.date,
      status: item.status,
    }));
  },

  async getAttendanceById(id: string): Promise<TeacherAttendanceResponse | null> {
    const item = await TeacherAttendance.findByPk(id);
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      teacher_id: item.teacher_id,
      date: item.date,
      status: item.status,
    };
  },

  async updateAttendance(
    id: string,
    input: UpdateTeacherAttendanceDTO
  ): Promise<TeacherAttendanceResponse> {
    const attendance = await TeacherAttendance.findByPk(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    const updated = await attendance.update({ status: input.status });
    return {
      id: updated.id,
      teacher_id: updated.teacher_id,
      date: updated.date,
      status: updated.status,
    };
  },

  async deleteAttendance(id: string): Promise<void> {
    const attendance = await TeacherAttendance.findByPk(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }
    await attendance.destroy();
  },
};
