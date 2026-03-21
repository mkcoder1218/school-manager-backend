import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Role } from './role.model';
import { buildListQuery, buildMeta } from '../../core/utils/query';
import { ROLE_HIERARCHY } from '../rbac/role-hierarchy';

export const listRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorRole = req.user?.role;
    const actorSchoolId = req.user?.school_id ?? null;
    if (actorRole !== 'super_admin' && !actorSchoolId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      {
        allowedSort: ['name', 'createdAt'],
        // Prevent client-supplied school_id from excluding global roles
        allowedFilters: ['name'],
      }
    );

    let finalWhere =
      actorRole === 'super_admin'
        ? where
        : {
            ...where,
            [Op.or]: [{ school_id: actorSchoolId as string }, { school_id: null }],
          };

    const visibleRoles = actorRole ? ROLE_HIERARCHY[actorRole] : undefined;
    if (visibleRoles) {
      finalWhere = {
        ...finalWhere,
        name: {
          [Op.in]: visibleRoles,
        },
      };
    }

    const { rows, count } = await Role.findAndCountAll({
      where: finalWhere,
      order: orderBy,
      limit,
      offset,
    });

    res.status(200).json({
      data: rows.map((role) => role.get({ plain: true })),
      meta: buildMeta({ page, limit, total: count, sort, order }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
