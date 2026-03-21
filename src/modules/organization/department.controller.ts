import { Request, Response } from 'express';
import { Department } from './department.model';
import { School } from '../platform/school.model';
import { Branch } from './branch.model';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validation';
import { buildListQuery, buildMeta } from '../../core/utils/query';

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createDepartmentSchema.validate(req.body, { abortEarly: false });
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

    const branch = await Branch.findByPk(value.branch_id);
    if (!branch) {
      res.status(400).json({ message: 'Branch not found' });
      return;
    }

    if (branch.school_id !== value.school_id) {
      res.status(400).json({ message: 'Branch does not belong to the school' });
      return;
    }

    const department = await Department.create(value);
    res.status(201).json({ message: 'Department created successfully', data: department });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listDepartments = async (_req: Request, res: Response): Promise<void> => {
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
    const result = await Department.findAndCountAll({
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

export const getDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && department.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ data: department });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateDepartmentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && department.school_id !== actorSchoolId) {
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

      const schoolId = value.school_id ?? department.school_id;
      if (branch.school_id !== schoolId) {
        res.status(400).json({ message: 'Branch does not belong to the school' });
        return;
      }
    }

    await department.update(value);
    res.status(200).json({ message: 'Department updated successfully', data: department });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && department.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await department.destroy();
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
