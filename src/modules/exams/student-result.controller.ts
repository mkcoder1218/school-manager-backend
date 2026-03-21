import { Request, Response } from 'express';
import { StudentResult } from './student-result.model';
import { School } from '../platform/school.model';
import { Student } from '../students/student.model';
import { ExamSubject } from './exam-subject.model';
import { createStudentResultSchema, updateStudentResultSchema } from './student-result.validation';
import { buildListQuery, buildMeta } from '../../core/utils/query';

export const createStudentResult = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createStudentResultSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const actorSchoolId = req.user?.school_id ?? null;
  if (actorRole !== 'super_admin' && actorSchoolId !== value.school_id) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const school = await School.findByPk(value.school_id);
    if (!school) {
      res.status(400).json({ message: 'School not found' });
      return;
    }

    const student = await Student.findByPk(value.student_id);
    if (!student) {
      res.status(400).json({ message: 'Student not found' });
      return;
    }

    if (student.school_id !== value.school_id) {
      res.status(400).json({ message: 'Student does not belong to the school' });
      return;
    }

    const examSubject = await ExamSubject.findByPk(value.exam_subject_id);
    if (!examSubject) {
      res.status(400).json({ message: 'Exam subject not found' });
      return;
    }

    const result = await StudentResult.create(value);
    res.status(201).json({ message: 'Student result created successfully', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listStudentResults = async (_req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = _req.user?.role;
    const actorSchoolId = _req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && !actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      _req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'score'] }
    );
    const finalWhere =
      actorRole === 'super_admin' ? where : { ...where, school_id: actorSchoolId as string };
    const result = await StudentResult.findAndCountAll({
      where: finalWhere,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({
      data: result.rows,
      meta: buildMeta({ page, limit, total: result.count, sort, order }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await StudentResult.findByPk(req.params.id);
    if (!result) {
      res.status(404).json({ message: 'Student result not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && result.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudentResult = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateStudentResultSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const result = await StudentResult.findByPk(req.params.id);
    if (!result) {
      res.status(404).json({ message: 'Student result not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && result.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (value.school_id && actorRole !== 'super_admin' && value.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (value.school_id) {
      const school = await School.findByPk(value.school_id);
      if (!school) {
        res.status(400).json({ message: 'School not found' });
        return;
      }
    }

    if (value.student_id) {
      const student = await Student.findByPk(value.student_id);
      if (!student) {
        res.status(400).json({ message: 'Student not found' });
        return;
      }

      const schoolId = value.school_id ?? result.school_id;
      if (student.school_id !== schoolId) {
        res.status(400).json({ message: 'Student does not belong to the school' });
        return;
      }
    }

    if (value.exam_subject_id) {
      const examSubject = await ExamSubject.findByPk(value.exam_subject_id);
      if (!examSubject) {
        res.status(400).json({ message: 'Exam subject not found' });
        return;
      }
    }

    await result.update(value);
    res.status(200).json({ message: 'Student result updated successfully', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudentResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await StudentResult.findByPk(req.params.id);
    if (!result) {
      res.status(404).json({ message: 'Student result not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && result.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await result.destroy();
    res.status(200).json({ message: 'Student result deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
