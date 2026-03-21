import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import { createSchoolSchema, updateSchoolSchema } from './school.validation';
import { OwnerEmailExistsError, schoolService } from './school.service';
import { CreateSchoolDTO, UpdateSchoolDTO } from './school.types';
import { buildListQuery, buildMeta } from '../../core/utils/query';

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createSchoolSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const result = await schoolService.createSchool(value as CreateSchoolDTO);
    res.status(201).json({
      message: 'School and owner created successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof OwnerEmailExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    if (error instanceof UniqueConstraintError) {
      const fields = Object.keys(error.fields ?? {});
      if (fields.includes('email')) {
        res.status(409).json({ message: 'School email already exists' });
        return;
      }
      if (fields.includes('domain')) {
        res.status(409).json({ message: 'School domain already exists' });
        return;
      }
      res.status(409).json({ message: 'School already exists' });
      return;
    }
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listSchools = async (_req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = _req.user?.role;
    if (actorRole !== 'super_admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(_req.query as Record<string, unknown>, {
      allowedSort: ['createdAt', 'name', 'email'],
    });
    const { rows, count } = await schoolService.listSchools({ limit, offset, order: orderBy, where });
    res.status(200).json({ data: rows, meta: buildMeta({ page, limit, total: count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSchool = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateSchoolSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const actorRole = req.user?.role;
    if (actorRole !== 'super_admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await schoolService.updateSchool(req.params.id, value as UpdateSchoolDTO);
    if (!updated) {
      res.status(404).json({ message: 'School not found' });
      return;
    }

    res.status(200).json({ message: 'School updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
