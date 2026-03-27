import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { listRoles } from './role.controller';

/**
 * @openapi
 * tags:
 *   - name: Roles
 *     description: Role management
 */

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: List roles
 *     description: Not implemented
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *       501:
 *         description: Not implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not implemented
 */

export const roleRouter = Router();

roleRouter.get('/', authenticateJWT, authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal','teacher',
      'registrar',
      'accountant',
      'parent',
      'student',
      'cleaner',
      'registrar','registral',
      'security',
      'librarian',
      'finance',), listRoles);
