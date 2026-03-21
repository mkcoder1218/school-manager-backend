import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { createBranch, deleteBranch, listBranches, updateBranch } from './branch.controller';

export const branchRouter = Router();

branchRouter.get(
  '/branches',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  listBranches
);

branchRouter.post(
  '/branches',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  createBranch
);

branchRouter.put(
  '/branches/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  updateBranch
);

branchRouter.delete(
  '/branches/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  deleteBranch
);

/**
 * @openapi
 * /api/branches:
 *   post:
 *     tags:
 *       - Branches
 *     summary: Create branch
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - school_id
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               school_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Branch created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
