import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  listTeachers,
  updateTeacher,
} from './teacher.controller';

export const teacherRouter = Router();

/**
 * @openapi
 * /api/teachers:
 *   post:
 *     tags:
 *       - Teachers
 *     summary: Create teacher
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, employee_id]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               branch_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               employee_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

teacherRouter.post(
  '/teachers',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  createTeacher
);

/**
 * @openapi
 * /api/teachers:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: List teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher list
 */

teacherRouter.get(
  '/teachers',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  listTeachers
);

/**
 * @openapi
 * /api/teachers/{id}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher
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
 *         description: Teacher details
 *       404:
 *         description: Teacher not found
 */

teacherRouter.get(
  '/teachers/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  getTeacher
);

/**
 * @openapi
 * /api/teachers/{id}:
 *   put:
 *     tags:
 *       - Teachers
 *     summary: Update teacher
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
 *                 nullable: true
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               employee_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher updated
 *       404:
 *         description: Teacher not found
 */

teacherRouter.put(
  '/teachers/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  updateTeacher
);

/**
 * @openapi
 * /api/teachers/{id}:
 *   delete:
 *     tags:
 *       - Teachers
 *     summary: Delete teacher
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
 *         description: Teacher deleted
 *       404:
 *         description: Teacher not found
 */

teacherRouter.delete(
  '/teachers/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  deleteTeacher
);
