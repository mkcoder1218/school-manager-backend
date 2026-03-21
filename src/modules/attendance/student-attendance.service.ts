import { StudentAttendance } from './student-attendance.model';
import { Student } from '../students/student.model';
import { Class } from '../academics/class.model';
import { Section } from '../academics/section.model';
import { generateUuid } from '../../core/utils/uuid';
import {
  CreateStudentAttendanceDTO,
  StudentAttendanceResponse,
  UpdateStudentAttendanceDTO,
} from './student-attendance.types';

export class StudentNotFoundError extends Error {
  constructor() {
    super('Student not found');
  }
}

export class ClassNotFoundError extends Error {
  constructor() {
    super('Class not found');
  }
}

export class SectionNotFoundError extends Error {
  constructor() {
    super('Section not found');
  }
}

export class SectionMismatchError extends Error {
  constructor() {
    super('Section does not belong to the class');
  }
}

export class SchoolMismatchError extends Error {
  constructor() {
    super('Entity does not belong to the school');
  }
}

export class AttendanceExistsError extends Error {
  constructor() {
    super('Attendance already recorded for this student');
  }
}

export class AttendanceNotFoundError extends Error {
  constructor() {
    super('Attendance not found');
  }
}

export const studentAttendanceService = {
  async createAttendance(
    input: CreateStudentAttendanceDTO
  ): Promise<StudentAttendanceResponse> {
    const student = await Student.findByPk(input.student_id);
    if (!student) {
      throw new StudentNotFoundError();
    }

    const clazz = await Class.findByPk(input.class_id);
    if (!clazz) {
      throw new ClassNotFoundError();
    }

    const section = await Section.findByPk(input.section_id);
    if (!section) {
      throw new SectionNotFoundError();
    }

    if (section.class_id !== clazz.id) {
      throw new SectionMismatchError();
    }

    if (student.school_id !== clazz.school_id || section.school_id !== clazz.school_id) {
      throw new SchoolMismatchError();
    }

    const existing = await StudentAttendance.findOne({
      where: {
        student_id: input.student_id,
        class_id: input.class_id,
        section_id: input.section_id,
        date: input.date,
      },
    });
    if (existing) {
      throw new AttendanceExistsError();
    }

    const attendance = await StudentAttendance.create({
      id: generateUuid(),
      school_id: clazz.school_id,
      student_id: input.student_id,
      class_id: input.class_id,
      section_id: input.section_id,
      date: input.date,
      status: input.status,
    });

    return {
      id: attendance.id,
      student_id: attendance.student_id,
      class_id: attendance.class_id,
      section_id: attendance.section_id,
      date: attendance.date,
      status: attendance.status,
    };
  },

  async listAttendance(schoolId: string): Promise<StudentAttendanceResponse[]> {
    const items = await StudentAttendance.findAll({ where: { school_id: schoolId } });
    return items.map((item) => ({
      id: item.id,
      student_id: item.student_id,
      class_id: item.class_id,
      section_id: item.section_id,
      date: item.date,
      status: item.status,
    }));
  },

  async getAttendanceById(id: string): Promise<StudentAttendanceResponse | null> {
    const item = await StudentAttendance.findByPk(id);
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      student_id: item.student_id,
      class_id: item.class_id,
      section_id: item.section_id,
      date: item.date,
      status: item.status,
    };
  },

  async updateAttendance(
    id: string,
    input: UpdateStudentAttendanceDTO
  ): Promise<StudentAttendanceResponse> {
    const attendance = await StudentAttendance.findByPk(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    const updated = await attendance.update({ status: input.status });
    return {
      id: updated.id,
      student_id: updated.student_id,
      class_id: updated.class_id,
      section_id: updated.section_id,
      date: updated.date,
      status: updated.status,
    };
  },

  async deleteAttendance(id: string): Promise<void> {
    const attendance = await StudentAttendance.findByPk(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }
    await attendance.destroy();
  },
};
