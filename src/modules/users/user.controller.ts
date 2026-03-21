import { Request, Response } from 'express';
import { createUserSchema } from './user.validation';
import {
  BranchMismatchError,
  BranchNotFoundError,
  EmailExistsError,
  RoleNotFoundError,
  userService,
} from './user.service';
import { CreateUserDTO } from './user.types';
import { buildListQuery, buildMeta } from '../../core/utils/query';
import { User } from './user.model';
import { UserRole } from '../rbac/user-role.model';
import { Role } from '../roles/role.model';
import { ROLE_HIERARCHY } from '../rbac/role-hierarchy';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const actorRole = req.user?.role;
  const actorSchoolId = req.user?.school_id ?? null;
  const targetSchoolId = (value as CreateUserDTO).school_id;

  if (actorRole !== 'super_admin' && actorSchoolId !== targetSchoolId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const allowedRoles = actorRole ? ROLE_HIERARCHY[actorRole] : undefined;
  if (allowedRoles && !allowedRoles.includes((value as CreateUserDTO).role)) {
    res.status(403).json({ message: 'Insufficient role level' });
    return;
  }

  if (actorRole === 'school_admin') {
    const actorUser = await User.findByPk(req.user?.user_id ?? '');
    const actorBranchId = actorUser?.branch_id ?? null;
    const targetBranchId = (value as CreateUserDTO).branch_id;
    if (!actorBranchId || actorBranchId !== targetBranchId) {
      res.status(403).json({ message: 'Branch restriction' });
      return;
    }
  }

  try {
    const user = await userService.createUser(value as CreateUserDTO);
    res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof EmailExistsError) {
      res.status(409).json({ message: error.message });
      return;
    }
    if (error instanceof RoleNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof BranchNotFoundError || error instanceof BranchMismatchError) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userRoles = await UserRole.findAll({ where: { user_id: user.id } });
    const roleIds = userRoles.map((ur) => ur.role_id);
    const roles = roleIds.length ? await Role.findAll({ where: { id: roleIds } }) : [];
    const roleNames = roles.map((r) => r.name);

    res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        status: user.status,
        school_id: user.school_id,
        branch_id: user.branch_id,
        roles: roleNames,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userService.getUserMessages(req.params.user_id);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    const actorUserId = req.user?.user_id;
    const actorUser = actorUserId ? await User.findByPk(actorUserId) : null;
    const actorBranchId = actorUser?.branch_id ?? null;
    if (actorRole !== 'super_admin' && !actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    if (actorRole === 'school_admin' && !actorBranchId) {
      res.status(403).json({ message: 'Branch restriction' });
      return;
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'email', 'firstName', 'lastName'] }
    );

    const result = await userService.listUsers({
      actorRole,
      actorSchoolId,
      actorUserId,
      actorBranchId,
      where,
      order: orderBy,
      limit,
      offset,
    });

    res.status(200).json({
      data: result.rows,
      meta: buildMeta({ page, limit, total: result.count, sort, order }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
