import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  updateDepartment,
} from './department.controller';

export const departmentRouter = Router();

/**
 * @openapi
 * /api/departments:
 *   post:
 *     tags:
 *       - Departments
 *     summary: Create department
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, branch_id, name]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               branch_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

departmentRouter.post(
  '/departments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  createDepartment
);

/**
 * @openapi
 * /api/departments:
 *   get:
 *     tags:
 *       - Departments
 *     summary: List departments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

departmentRouter.get(
  '/departments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  listDepartments
);

/**
 * @openapi
 * /api/departments/{id}:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get department
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
 *         description: Department details
 *       404:
 *         description: Department not found
 */

departmentRouter.get(
  '/departments/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  getDepartment
);

/**
 * @openapi
 * /api/departments/{id}:
 *   put:
 *     tags:
 *       - Departments
 *     summary: Update department
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
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               branch_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Department not found
 */

departmentRouter.put(
  '/departments/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  updateDepartment
);

/**
 * @openapi
 * /api/departments/{id}:
 *   delete:
 *     tags:
 *       - Departments
 *     summary: Delete department
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
 *         description: Department deleted
 *       404:
 *         description: Department not found
 */

departmentRouter.delete(
  '/departments/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  deleteDepartment
);
