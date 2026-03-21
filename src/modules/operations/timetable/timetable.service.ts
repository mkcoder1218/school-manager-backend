import { Op } from 'sequelize';
import { Timetable } from './timetable.model';
import { Class } from '../../academics/class.model';
import { Section } from '../../academics/section.model';
import { Subject } from '../../academics/subject.model';
import { Teacher } from '../../teachers/teacher.model';
import { generateUuid } from '../../../core/utils/uuid';
import { CreateTimetableDTO, TimetableResponse, UpdateTimetableDTO } from './timetable.types';

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

export class SubjectNotFoundError extends Error {
  constructor() {
    super('Subject not found');
  }
}

export class TeacherNotFoundError extends Error {
  constructor() {
    super('Teacher not found');
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

export class TimetableNotFoundError extends Error {
  constructor() {
    super('Timetable entry not found');
  }
}

export class TimetableConflictError extends Error {
  constructor() {
    super('Timetable overlaps with existing entry');
  }
}

export const timetableService = {
  async createTimetable(input: CreateTimetableDTO): Promise<TimetableResponse> {
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

    const subject = await Subject.findByPk(input.subject_id);
    if (!subject) {
      throw new SubjectNotFoundError();
    }

    const teacher = await Teacher.findByPk(input.teacher_id);
    if (!teacher) {
      throw new TeacherNotFoundError();
    }

    if (
      clazz.school_id !== subject.school_id ||
      clazz.school_id !== teacher.school_id ||
      section.school_id !== clazz.school_id
    ) {
      throw new SchoolMismatchError();
    }

    const overlapWhere = {
      day: input.day,
      [Op.and]: [{ start_time: { [Op.lt]: input.end_time } }, { end_time: { [Op.gt]: input.start_time } }],
    };

    const classOverlap = await Timetable.findOne({
      where: {
        school_id: clazz.school_id,
        class_id: input.class_id,
        section_id: input.section_id,
        ...overlapWhere,
      },
    });
    if (classOverlap) {
      throw new TimetableConflictError();
    }

    const teacherOverlap = await Timetable.findOne({
      where: {
        school_id: clazz.school_id,
        teacher_id: input.teacher_id,
        ...overlapWhere,
      },
    });
    if (teacherOverlap) {
      throw new TimetableConflictError();
    }

    const entry = await Timetable.create({
      id: generateUuid(),
      school_id: clazz.school_id,
      class_id: input.class_id,
      section_id: input.section_id,
      subject_id: input.subject_id,
      teacher_id: input.teacher_id,
      day: input.day,
      start_time: input.start_time,
      end_time: input.end_time,
    });

    return entry.get({ plain: true }) as TimetableResponse;
  },

  async listTimetable(schoolId: string, filters: { class_id?: string; section_id?: string; teacher_id?: string }) {
    const where: Record<string, unknown> = { school_id: schoolId };
    if (filters.class_id) {
      where.class_id = filters.class_id;
    }
    if (filters.section_id) {
      where.section_id = filters.section_id;
    }
    if (filters.teacher_id) {
      where.teacher_id = filters.teacher_id;
    }
    const items = await Timetable.findAll({ where });
    return items.map((item) => item.get({ plain: true }) as TimetableResponse);
  },

  async getTimetableById(id: string): Promise<TimetableResponse | null> {
    const item = await Timetable.findByPk(id);
    return item ? (item.get({ plain: true }) as TimetableResponse) : null;
  },

  async updateTimetable(id: string, input: UpdateTimetableDTO): Promise<TimetableResponse> {
    const existing = await Timetable.findByPk(id);
    if (!existing) {
      throw new TimetableNotFoundError();
    }

    const classId = input.class_id ?? existing.class_id;
    const sectionId = input.section_id ?? existing.section_id;
    const subjectId = input.subject_id ?? existing.subject_id;
    const teacherId = input.teacher_id ?? existing.teacher_id;
    const day = input.day ?? existing.day;
    const startTime = input.start_time ?? existing.start_time;
    const endTime = input.end_time ?? existing.end_time;

    const clazz = await Class.findByPk(classId);
    if (!clazz) {
      throw new ClassNotFoundError();
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      throw new SectionNotFoundError();
    }

    if (section.class_id !== clazz.id) {
      throw new SectionMismatchError();
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      throw new SubjectNotFoundError();
    }

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      throw new TeacherNotFoundError();
    }

    if (
      clazz.school_id !== subject.school_id ||
      clazz.school_id !== teacher.school_id ||
      section.school_id !== clazz.school_id
    ) {
      throw new SchoolMismatchError();
    }

    const overlapWhere = {
      day,
      [Op.and]: [{ start_time: { [Op.lt]: endTime } }, { end_time: { [Op.gt]: startTime } }],
      id: { [Op.ne]: id },
    };

    const classOverlap = await Timetable.findOne({
      where: {
        school_id: clazz.school_id,
        class_id: classId,
        section_id: sectionId,
        ...overlapWhere,
      },
    });
    if (classOverlap) {
      throw new TimetableConflictError();
    }

    const teacherOverlap = await Timetable.findOne({
      where: {
        school_id: clazz.school_id,
        teacher_id: teacherId,
        ...overlapWhere,
      },
    });
    if (teacherOverlap) {
      throw new TimetableConflictError();
    }

    const updated = await existing.update({
      class_id: classId,
      section_id: sectionId,
      subject_id: subjectId,
      teacher_id: teacherId,
      day,
      start_time: startTime,
      end_time: endTime,
    });

    return updated.get({ plain: true }) as TimetableResponse;
  },

  async deleteTimetable(id: string): Promise<void> {
    const item = await Timetable.findByPk(id);
    if (!item) {
      throw new TimetableNotFoundError();
    }
    await item.destroy();
  },
};
