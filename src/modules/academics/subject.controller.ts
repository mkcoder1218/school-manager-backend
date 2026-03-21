import { Request, Response } from 'express';
import { Subject } from './subject.model';
import { School } from '../platform/school.model';
import { createSubjectSchema, updateSubjectSchema } from './subject.validation';
import { buildListQuery, buildMeta } from '../../core/utils/query';

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createSubjectSchema.validate(req.body, { abortEarly: false });
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

    const subject = await Subject.create(value);
    res.status(201).json({ message: 'Subject created successfully', data: subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listSubjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = _req.user?.role;
    const actorSchoolId = _req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && !actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      _req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'name'] }
    );

    const finalWhere =
      actorRole === 'super_admin' ? where : { ...where, school_id: actorSchoolId as string };

    const result = await Subject.findAndCountAll({
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

export const getSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && subject.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateSubjectSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && subject.school_id !== actorSchoolId) {
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

    await subject.update(value);
    res.status(200).json({ message: 'Subject updated successfully', data: subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && subject.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await subject.destroy();
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
