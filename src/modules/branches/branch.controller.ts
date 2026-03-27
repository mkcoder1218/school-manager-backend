import { Request, Response } from 'express';
import { createBranchSchema, updateBranchSchema } from './branch.validation';
import { branchService, SchoolNotFoundError } from './branch.service';
import { CreateBranchDTO } from './branch.types';
import { buildListQuery, buildMeta } from '../../core/utils/query';
import { User } from '../users/user.model';

export const createBranch = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createBranchSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const actorSchoolId = req.user?.school_id ?? null;
  const targetSchoolId = (value as CreateBranchDTO).school_id;

  if (actorRole !== 'super_admin' && actorSchoolId !== targetSchoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const branch = await branchService.createBranch(value as CreateBranchDTO);
    res.status(201).json({
      message: 'Branch created successfully',
      data: branch,
    });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const listBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    const actorUserId = req.user?.user_id;
    if (actorRole !== 'super_admin' && !actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const isGlobal = actorRole === 'super_admin';
    const canSeeAllBranchesInSchool = actorRole === 'school_owner';
    const mustBeInOwnBranch = !isGlobal && !canSeeAllBranchesInSchool;

    let actorBranchId: string | null = null;
    if (mustBeInOwnBranch) {
      const actorUser = actorUserId ? await User.findByPk(actorUserId) : null;
      actorBranchId = actorUser?.branch_id ?? null;
      if (!actorBranchId) {
        res.status(403).json({ message: 'Branch restriction' });
        return;
      }
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'name'] }
    );

    const { rows, count } = await branchService.listBranches({
      schoolId: isGlobal ? null : actorSchoolId,
      where: mustBeInOwnBranch ? { ...where, id: actorBranchId as string } : where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: rows, meta: buildMeta({ page, limit, total: count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBranch = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateBranchSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const branch = await branchService.updateBranch(req.params.id, value as CreateBranchDTO);
    if (!branch) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }

    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && branch.school_id !== actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ message: 'Branch updated successfully', data: branch });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await branchService.deleteBranch(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }

    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
