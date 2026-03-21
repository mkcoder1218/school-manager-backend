import { Request, Response } from 'express';
import {
  AcademicYearNotFoundError,
  ClassNotFoundError,
  EnrollmentNotFoundError,
  AttendanceNotFoundError,
  ExamNotFoundError,
  ExamSubjectNotFoundError,
  QuestionNotFoundError,
  SchoolMismatchError,
  SchoolNotFoundError,
  SectionMismatchError,
  SectionNotFoundError,
  StudentNotFoundError,
  SubjectNotFoundError,
  SubmissionAlreadyExistsError,
  examService,
} from './exam.service';
import {
  createExamSchema,
  createExamSubjectSchema,
  createQuestionSchema,
  createStudentAnswerSchema,
  submitExamSchema,
  updateExamSchema,
} from './exam.validation';
import {
  CreateExamDTO,
  CreateExamSubjectDTO,
  CreateQuestionDTO,
  CreateStudentAnswerDTO,
  SubmitExamAnswerDTO,
  UpdateExamDTO,
} from './exam.types';
import { Enrollment } from '../academics/enrollment.model';
import { buildListQuery, buildMeta } from '../../core/utils/query';

const resolveSchoolId = (req: Request, bodySchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return bodySchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createExam = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createExamSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const dto = value as CreateExamDTO;
  if (dto.start_date > dto.end_date) {
    res.status(400).json({ message: 'start_date must be before end_date' });
    return;
  }
  if (dto.start_time >= dto.end_time) {
    res.status(400).json({ message: 'start_time must be before end_time' });
    return;
  }

  const schoolId = resolveSchoolId(req, dto.school_id);
  if (!schoolId || (req.user?.role !== 'super_admin' && dto.school_id !== schoolId)) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const exam = await examService.createExam(dto);
    res.status(201).json({ message: 'Exam created successfully', data: exam });
  } catch (error) {
    if (
      error instanceof SchoolNotFoundError ||
      error instanceof AcademicYearNotFoundError ||
      error instanceof ClassNotFoundError ||
      error instanceof SectionNotFoundError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolMismatchError || error instanceof SectionMismatchError) {
      res.status(403).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listExams = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  if (req.user?.role === 'student') {
    const studentId = req.query.student_id as string | undefined;
    if (!studentId || studentId !== req.user.user_id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  }
  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'name', 'exam_date'] }
    );
    const result = await examService.listExams(schoolId, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listExamsByClass = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  if (req.user?.role === 'student') {
    const studentId = req.query.student_id as string | undefined;
    if (!studentId || studentId !== req.user.user_id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const enrollment = await Enrollment.findOne({
      where: { student_id: studentId, class_id: req.params.class_id },
    });
    if (!enrollment) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  }

  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'name', 'exam_date'] }
    );
    const result = await examService.listExamsByClass(schoolId, req.params.class_id, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listExamsBySection = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }

  if (req.user?.role === 'student') {
    const studentId = req.query.student_id as string | undefined;
    if (!studentId || studentId !== req.user.user_id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const enrollment = await Enrollment.findOne({
      where: { student_id: studentId, section_id: req.params.section_id },
    });
    if (!enrollment) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  }

  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'name', 'exam_date'] }
    );
    const result = await examService.listExamsBySection(schoolId, req.params.section_id, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = await examService.getExamById(req.params.id);
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, exam.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && exam.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    if (req.user?.role === 'student') {
      const studentId = req.query.student_id as string | undefined;
      if (!studentId || studentId !== req.user.user_id) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }
    res.status(200).json({ data: exam });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateExam = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateExamSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  const dto = value as UpdateExamDTO;
  if (dto.start_date && dto.end_date && dto.start_date > dto.end_date) {
    res.status(400).json({ message: 'start_date must be before end_date' });
    return;
  }
  if (dto.start_time && dto.end_time && dto.start_time >= dto.end_time) {
    res.status(400).json({ message: 'start_time must be before end_time' });
    return;
  }
  try {
    const exam = await examService.getExamById(req.params.id);
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, exam.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && exam.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const updated = await examService.updateExam(req.params.id, dto);
    res.status(200).json({ message: 'Exam updated successfully', data: updated });
  } catch (error) {
    if (error instanceof ExamNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof ClassNotFoundError || error instanceof SectionNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolMismatchError || error instanceof SectionMismatchError) {
      res.status(403).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = await examService.getExamById(req.params.id);
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }
    const schoolId = resolveSchoolId(req, exam.school_id);
    if (!schoolId || (req.user?.role !== 'super_admin' && exam.school_id !== schoolId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    await examService.deleteExam(req.params.id);
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    if (error instanceof ExamNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const createExamSubject = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createExamSubjectSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const examSubject = await examService.createExamSubject(value as CreateExamSubjectDTO);
    res.status(201).json({ message: 'Exam subject created successfully', data: examSubject });
  } catch (error) {
    if (error instanceof ExamNotFoundError || error instanceof SubjectNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolMismatchError) {
      res.status(403).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createQuestionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  const dto = value as CreateQuestionDTO;
  if (dto.type === 'multiple_choice') {
    if (!dto.options || dto.options.length === 0 || dto.correct_answer === undefined) {
      res.status(400).json({ message: 'options and correct_answer are required for multiple_choice' });
      return;
    }
  }
  if (dto.type === 'true_false') {
    if (typeof dto.correct_answer !== 'boolean') {
      res.status(400).json({ message: 'correct_answer must be boolean for true_false' });
      return;
    }
  }
  try {
    const question = await examService.createQuestion(dto);
    res.status(201).json({ message: 'Question created successfully', data: question });
  } catch (error) {
    if (error instanceof ExamSubjectNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const createStudentAnswer = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createStudentAnswerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  const dto = value as CreateStudentAnswerDTO;

  if (req.user?.role === 'student' && req.user.user_id !== dto.student_id) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const answer = await examService.createStudentAnswer(dto);
    res.status(201).json({ message: 'Answer submitted successfully', data: answer });
  } catch (error) {
    if (
      error instanceof StudentNotFoundError ||
      error instanceof QuestionNotFoundError ||
      error instanceof ExamSubjectNotFoundError ||
      error instanceof ExamNotFoundError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolMismatchError) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof SubmissionAlreadyExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitExam = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = submitExamSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const dto = value as { student_id: string; answers: SubmitExamAnswerDTO[] };
  if (req.user?.role === 'student' && req.user.user_id !== dto.student_id) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const answers = await examService.submitExamAnswers(
      req.params.exam_id,
      dto.student_id,
      dto.answers
    );
    res.status(201).json({ message: 'Exam submitted successfully', data: answers });
  } catch (error) {
    if (
      error instanceof StudentNotFoundError ||
      error instanceof QuestionNotFoundError ||
      error instanceof ExamSubjectNotFoundError ||
      error instanceof ExamNotFoundError ||
      error instanceof EnrollmentNotFoundError ||
      error instanceof AttendanceNotFoundError
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolMismatchError || error instanceof SectionMismatchError) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof SubmissionAlreadyExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.query.student_id as string | undefined;
    if (req.user?.role === 'student' && req.user.user_id !== studentId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    if (req.user?.role === 'student' && studentId) {
      const exam = await examService.getExamById(req.params.exam_id);
      if (!exam) {
        res.status(404).json({ message: 'Exam not found' });
        return;
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
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }
    const results = await examService.getStudentResultsByExam(req.params.exam_id, studentId);
    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
