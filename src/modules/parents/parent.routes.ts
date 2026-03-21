import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { createParent, deleteParent, getParent, updateParent } from './parent.controller';

export const parentRouter = Router();

parentRouter.post(
  '/',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createParent
);

/**
 * @openapi
 * /api/parents:
 *   post:
 *     tags:
 *       - Parents
 *     summary: Create parent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, school_id]
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *               phone:
 *                 type: string
 *                 nullable: true
 *               parent_subscription_required:
 *                 type: boolean
 *               subscription_start_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               subscription_end_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               payment_status:
 *                 type: string
 *                 enum: [pending, paid, free]
 *     responses:
 *       201:
 *         description: Parent created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Email already exists
 */

parentRouter.get(
  '/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  getParent
);

/**
 * @openapi
 * /api/parents/{id}:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Get parent details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Parent details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Parent not found
 */

parentRouter.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  updateParent
);

/**
 * @openapi
 * /api/parents/{id}:
 *   put:
 *     tags:
 *       - Parents
 *     summary: Update parent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               parent_subscription_required:
 *                 type: boolean
 *               subscription_start_date:
 *                 type: string
 *                 format: date
 *               subscription_end_date:
 *                 type: string
 *                 format: date
 *               payment_status:
 *                 type: string
 *                 enum: [pending, paid, free]
 *     responses:
 *       200:
 *         description: Parent updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Parent not found
 *       409:
 *         description: Email already exists
 */

parentRouter.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  deleteParent
);

/**
 * @openapi
 * /api/parents/{id}:
 *   delete:
 *     tags:
 *       - Parents
 *     summary: Delete parent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Parent deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Parent not found
 */
