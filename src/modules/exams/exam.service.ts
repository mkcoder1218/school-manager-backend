import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Exam } from './exam.model';
import { ExamSubject } from './exam-subject.model';
import { Question } from './question.model';
import { StudentAnswer } from './student-answer.model';
import { School } from '../platform/school.model';
import { AcademicYear } from '../academics/academic-year.model';
import { Class } from '../academics/class.model';
import { Section } from '../academics/section.model';
import { Subject } from '../academics/subject.model';
import { Student } from '../students/student.model';
import { Enrollment } from '../academics/enrollment.model';
import { StudentAttendance } from '../attendance/student-attendance.model';
import { generateUuid } from '../../core/utils/uuid';
import {
  CreateExamDTO,
  CreateExamSubjectDTO,
  CreateQuestionDTO,
  CreateStudentAnswerDTO,
  ExamResponse,
  ExamSubjectResponse,
  QuestionResponse,
  SubmitExamAnswerDTO,
  StudentAnswerResponse,
  UpdateExamDTO,
} from './exam.types';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class AcademicYearNotFoundError extends Error {
  constructor() {
    super('Academic year not found');
  }
}

export class ExamNotFoundError extends Error {
  constructor() {
    super('Exam not found');
  }
}

export class ExamSubjectNotFoundError extends Error {
  constructor() {
    super('Exam subject not found');
  }
}

export class SubjectNotFoundError extends Error {
  constructor() {
    super('Subject not found');
  }
}

export class QuestionNotFoundError extends Error {
  constructor() {
    super('Question not found');
  }
}

export class StudentNotFoundError extends Error {
  constructor() {
    super('Student not found');
  }
}

export class SchoolMismatchError extends Error {
  constructor() {
    super('Entity does not belong to the school');
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

export class SubmissionAlreadyExistsError extends Error {
  constructor() {
    super('Student has already submitted answers for this exam');
  }
}

export class EnrollmentNotFoundError extends Error {
  constructor() {
    super('Student is not enrolled in this class/section');
  }
}

export class AttendanceNotFoundError extends Error {
  constructor() {
    super('Student is not marked present for this exam');
  }
}

const normalizeAnswer = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return '';
};

const isCorrectAnswer = (question: Question, answer: unknown): boolean => {
  if (question.type === 'multiple_choice') {
    if (Array.isArray(question.correct_answer)) {
      const expected = question.correct_answer.map(normalizeAnswer).sort();
      const actual = Array.isArray(answer) ? answer.map(normalizeAnswer).sort() : [];
      return expected.join('|') === actual.join('|');
    }
    return normalizeAnswer(question.correct_answer) === normalizeAnswer(answer);
  }
  if (question.type === 'true_false') {
    return normalizeAnswer(question.correct_answer) === normalizeAnswer(answer);
  }
  return false;
};

export const examService = {
  async createExam(input: CreateExamDTO): Promise<ExamResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }
    const academicYear = await AcademicYear.findByPk(input.academic_year_id);
    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }
    if (academicYear.school_id !== input.school_id) {
      throw new SchoolMismatchError();
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
    if (clazz.school_id !== input.school_id || section.school_id !== input.school_id) {
      throw new SchoolMismatchError();
    }

    const exam = await Exam.create({
      id: generateUuid(),
      school_id: input.school_id,
      academic_year_id: input.academic_year_id,
      class_id: input.class_id,
      section_id: input.section_id,
      name: input.name,
      start_date: input.start_date,
      end_date: input.end_date,
      exam_date: input.exam_date,
      start_time: input.start_time,
      end_time: input.end_time,
      type: input.type,
    });

    return exam.get({ plain: true }) as ExamResponse;
  },

  async listExams(
    schoolId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: ExamResponse[]; count: number }> {
    const result = await Exam.findAndCountAll({
      where: { school_id: schoolId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((exam) => exam.get({ plain: true }) as ExamResponse),
      count: result.count,
    };
  },

  async listExamsByClass(
    schoolId: string,
    classId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: ExamResponse[]; count: number }> {
    const result = await Exam.findAndCountAll({
      where: { school_id: schoolId, class_id: classId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((exam) => exam.get({ plain: true }) as ExamResponse),
      count: result.count,
    };
  },

  async listExamsBySection(
    schoolId: string,
    sectionId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: ExamResponse[]; count: number }> {
    const result = await Exam.findAndCountAll({
      where: { school_id: schoolId, section_id: sectionId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((exam) => exam.get({ plain: true }) as ExamResponse),
      count: result.count,
    };
  },

  async getExamById(id: string): Promise<ExamResponse | null> {
    const exam = await Exam.findByPk(id);
    return exam ? (exam.get({ plain: true }) as ExamResponse) : null;
  },

  async updateExam(id: string, input: UpdateExamDTO): Promise<ExamResponse> {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      throw new ExamNotFoundError();
    }
    const classId = input.class_id ?? exam.class_id;
    const sectionId = input.section_id ?? exam.section_id;
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
    if (clazz.school_id !== exam.school_id || section.school_id !== exam.school_id) {
      throw new SchoolMismatchError();
    }
    const updated = await exam.update({
      class_id: classId,
      section_id: sectionId,
      name: input.name ?? exam.name,
      start_date: input.start_date ?? exam.start_date,
      end_date: input.end_date ?? exam.end_date,
      exam_date: input.exam_date ?? exam.exam_date,
      start_time: input.start_time ?? exam.start_time,
      end_time: input.end_time ?? exam.end_time,
      type: input.type ?? exam.type,
    });
    return updated.get({ plain: true }) as ExamResponse;
  },

  async deleteExam(id: string): Promise<void> {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      throw new ExamNotFoundError();
    }
    await exam.destroy();
  },

  async createExamSubject(input: CreateExamSubjectDTO): Promise<ExamSubjectResponse> {
    const exam = await Exam.findByPk(input.exam_id);
    if (!exam) {
      throw new ExamNotFoundError();
    }
    const subject = await Subject.findByPk(input.subject_id);
    if (!subject) {
      throw new SubjectNotFoundError();
    }
    if (subject.school_id !== exam.school_id) {
      throw new SchoolMismatchError();
    }

    const examSubject = await ExamSubject.create({
      id: generateUuid(),
      school_id: exam.school_id,
      exam_id: input.exam_id,
      subject_id: input.subject_id,
      total_marks: input.total_marks,
      passing_marks: input.passing_marks,
    });

    return examSubject.get({ plain: true }) as ExamSubjectResponse;
  },

  async createQuestion(input: CreateQuestionDTO): Promise<QuestionResponse> {
    const examSubject = await ExamSubject.findByPk(input.exam_subject_id);
    if (!examSubject) {
      throw new ExamSubjectNotFoundError();
    }

    const question = await Question.create({
      id: generateUuid(),
      exam_subject_id: input.exam_subject_id,
      question_text: input.question_text,
      type: input.type,
      options: input.options ?? null,
      correct_answer: input.correct_answer ?? null,
      marks: input.marks,
    });

    return question.get({ plain: true }) as QuestionResponse;
  },

  async createStudentAnswer(input: CreateStudentAnswerDTO): Promise<StudentAnswerResponse> {
    const student = await Student.findByPk(input.student_id);
    if (!student) {
      throw new StudentNotFoundError();
    }

    const question = await Question.findByPk(input.question_id);
    if (!question) {
      throw new QuestionNotFoundError();
    }

    const examSubject = await ExamSubject.findByPk(question.exam_subject_id);
    if (!examSubject) {
      throw new ExamSubjectNotFoundError();
    }

    const exam = await Exam.findByPk(examSubject.exam_id);
    if (!exam) {
      throw new ExamNotFoundError();
    }

    if (exam.school_id !== student.school_id || examSubject.school_id !== student.school_id) {
      throw new SchoolMismatchError();
    }

    const examSubjectIds = await ExamSubject.findAll({
      where: { exam_id: exam.id },
      attributes: ['id'],
    });
    const examSubjectIdList = examSubjectIds.map((item) => item.id);
    const examQuestionIds = await Question.findAll({
      where: { exam_subject_id: { [Op.in]: examSubjectIdList } },
      attributes: ['id'],
    });
    const questionIdList = examQuestionIds.map((q) => q.id);

    const existing = await StudentAnswer.findOne({
      where: { student_id: input.student_id, question_id: { [Op.in]: questionIdList } },
    });
    if (existing) {
      throw new SubmissionAlreadyExistsError();
    }

    let marksObtained: number | null = null;
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      marksObtained = isCorrectAnswer(question, input.answer) ? Number(question.marks) : 0;
    }

    const answer = await StudentAnswer.create({
      id: generateUuid(),
      student_id: input.student_id,
      question_id: input.question_id,
      answer: input.answer,
      marks_obtained: marksObtained,
    });

    return answer.get({ plain: true }) as StudentAnswerResponse;
  },

  async submitExamAnswers(
    examId: string,
    studentId: string,
    answers: SubmitExamAnswerDTO[]
  ): Promise<StudentAnswerResponse[]> {
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      throw new ExamNotFoundError();
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new StudentNotFoundError();
    }

    if (exam.school_id !== student.school_id) {
      throw new SchoolMismatchError();
    }

    const enrollment = await Enrollment.findOne({
      where: {
        student_id: studentId,
        class_id: exam.class_id,
        section_id: exam.section_id,
        academic_year_id: exam.academic_year_id,
      },
    });
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    const attendance = await StudentAttendance.findOne({
      where: {
        student_id: studentId,
        class_id: exam.class_id,
        section_id: exam.section_id,
        date: exam.exam_date,
        status: 'present',
      },
    });
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    const examSubjects = await ExamSubject.findAll({
      where: { exam_id: exam.id },
      attributes: ['id'],
    });
    const examSubjectIds = examSubjects.map((item) => item.id);
    const examQuestions = await Question.findAll({
      where: { exam_subject_id: { [Op.in]: examSubjectIds } },
    });
    const questionMap = new Map(examQuestions.map((q) => [q.id, q]));

    const questionIds = examQuestions.map((q) => q.id);
    const existing = await StudentAnswer.findOne({
      where: { student_id: studentId, question_id: { [Op.in]: questionIds } },
    });
    if (existing) {
      throw new SubmissionAlreadyExistsError();
    }

    const toCreate = answers.map((item) => {
      const question = questionMap.get(item.question_id);
      if (!question) {
        throw new QuestionNotFoundError();
      }

      let marksObtained: number | null = null;
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        marksObtained = isCorrectAnswer(question, item.answer) ? Number(question.marks) : 0;
      }

      return {
        id: generateUuid(),
        student_id: studentId,
        question_id: item.question_id,
        answer: item.answer,
        marks_obtained: marksObtained,
      };
    });

    const created = await StudentAnswer.bulkCreate(toCreate);
    return created.map((answer) => answer.get({ plain: true }) as StudentAnswerResponse);
  },

  async getStudentResultsByExam(
    examId: string,
    studentId?: string
  ): Promise<
    Array<{
      student_id: string;
      total_marks: number;
      obtained_marks: number;
      pending_manual: boolean;
    }>
  > {
    const examSubjects = await ExamSubject.findAll({
      where: { exam_id: examId },
      attributes: ['id'],
    });
    const examSubjectIds = examSubjects.map((item) => item.id);
    const questions = await Question.findAll({
      where: { exam_subject_id: { [Op.in]: examSubjectIds } },
      attributes: ['id', 'marks'],
    });
    const questionIds = questions.map((q) => q.id);
    const questionMarks = new Map(questions.map((q) => [q.id, Number(q.marks)]));

    const answers = await StudentAnswer.findAll({
      where: {
        question_id: { [Op.in]: questionIds },
        ...(studentId ? { student_id: studentId } : {}),
      },
    });

    const grouped = new Map<
      string,
      { total_marks: number; obtained_marks: number; pending_manual: boolean }
    >();

    for (const answer of answers) {
      const entry = grouped.get(answer.student_id) ?? {
        total_marks: 0,
        obtained_marks: 0,
        pending_manual: false,
      };
      entry.total_marks += questionMarks.get(answer.question_id) ?? 0;
      if (answer.marks_obtained === null) {
        entry.pending_manual = true;
      } else {
        entry.obtained_marks += Number(answer.marks_obtained);
      }
      grouped.set(answer.student_id, entry);
    }

    return Array.from(grouped.entries()).map(([student_id, data]) => ({
      student_id,
      total_marks: data.total_marks,
      obtained_marks: data.obtained_marks,
      pending_manual: data.pending_manual,
    }));
  },
};
