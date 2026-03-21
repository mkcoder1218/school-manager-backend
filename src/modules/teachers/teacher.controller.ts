import { Request, Response } from 'express';
import { Teacher } from './teacher.model';
import { School } from '../platform/school.model';
import { Branch } from '../organization/branch.model';
import { User } from '../users/user.model';
import { createTeacherSchema, updateTeacherSchema } from './teacher.validation';
import { buildListQuery, buildMeta } from '../../core/utils/query';

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createTeacherSchema.validate(req.body, { abortEarly: false });
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

    if (value.branch_id) {
      const branch = await Branch.findByPk(value.branch_id);
      if (!branch) {
        res.status(400).json({ message: 'Branch not found' });
        return;
      }
      if (branch.school_id !== value.school_id) {
        res.status(400).json({ message: 'Branch does not belong to the school' });
        return;
      }
    }

    if (value.user_id) {
      const user = await User.findByPk(value.user_id);
      if (!user) {
        res.status(400).json({ message: 'User not found' });
        return;
      }
    }

    const teacher = await Teacher.create(value);
    res.status(201).json({ message: 'Teacher created successfully', data: teacher });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listTeachers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = _req.user?.role;
    const actorSchoolId = _req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && !actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      _req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'first_name', 'last_name'] }
    );
    const finalWhere =
      actorRole === 'super_admin' ? where : { ...where, school_id: actorSchoolId as string };

    const result = await Teacher.findAndCountAll({
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

export const getTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && teacher.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: teacher });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateTeacherSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && teacher.school_id !== actorSchoolId) {
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

    if (value.branch_id) {
      const branch = await Branch.findByPk(value.branch_id);
      if (!branch) {
        res.status(400).json({ message: 'Branch not found' });
        return;
      }

      const schoolId = value.school_id ?? teacher.school_id;
      if (branch.school_id !== schoolId) {
        res.status(400).json({ message: 'Branch does not belong to the school' });
        return;
      }
    }

    if (value.user_id) {
      const user = await User.findByPk(value.user_id);
      if (!user) {
        res.status(400).json({ message: 'User not found' });
        return;
      }
    }

    await teacher.update(value);
    res.status(200).json({ message: 'Teacher updated successfully', data: teacher });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && teacher.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await teacher.destroy();
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
