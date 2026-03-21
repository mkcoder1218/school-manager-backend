import { Enrollment } from './enrollment.model';
import { Student } from '../students/student.model';
import { Class } from './class.model';
import { Section } from './section.model';
import { AcademicYear } from './academic-year.model';
import { generateUuid } from '../../core/utils/uuid';
import { CreateEnrollmentDTO, EnrollmentResponse } from './enrollment.types';

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

export class AcademicYearNotFoundError extends Error {
  constructor() {
    super('Academic year not found');
  }
}

export class EnrollmentConflictError extends Error {
  constructor() {
    super('Student already enrolled in this class for the academic year');
  }
}

export class EnrollmentNotFoundError extends Error {
  constructor() {
    super('Enrollment not found');
  }
}

export class SchoolMismatchError extends Error {
  constructor() {
    super('Entity does not belong to the school');
  }
}

export class SectionMismatchError extends Error {
  constructor() {
    super('Section does not belong to the class');
  }
}

export const enrollmentService = {
  async createEnrollment(input: CreateEnrollmentDTO): Promise<EnrollmentResponse> {
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

    const academicYear = await AcademicYear.findByPk(input.academic_year_id);
    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }
    if (academicYear.school_id !== clazz.school_id) {
      throw new SchoolMismatchError();
    }

    const existing = await Enrollment.findOne({
      where: {
        student_id: input.student_id,
        class_id: input.class_id,
        academic_year_id: input.academic_year_id,
      },
    });
    if (existing) {
      throw new EnrollmentConflictError();
    }

    const enrollment = await Enrollment.create({
      id: generateUuid(),
      school_id: clazz.school_id,
      student_id: input.student_id,
      class_id: input.class_id,
      section_id: input.section_id,
      academic_year_id: input.academic_year_id,
    });

    return enrollment.get({ plain: true }) as EnrollmentResponse;
  },

  async listEnrollments(schoolId: string): Promise<EnrollmentResponse[]> {
    const enrollments = await Enrollment.findAll({ where: { school_id: schoolId } });
    return enrollments.map((enrollment) => enrollment.get({ plain: true }) as EnrollmentResponse);
  },

  async getEnrollmentById(id: string): Promise<EnrollmentResponse | null> {
    const enrollment = await Enrollment.findByPk(id);
    return enrollment ? (enrollment.get({ plain: true }) as EnrollmentResponse) : null;
  },

  async deleteEnrollment(id: string): Promise<void> {
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    await enrollment.destroy();
  },
};
