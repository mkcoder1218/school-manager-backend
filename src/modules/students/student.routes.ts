import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { createStudent, registerStudent } from './student.controller';

/**
 * @openapi
 * tags:
 *   - name: Students
 *     description: Student management
 */

/**
 * @openapi
 * /api/students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create a student
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - branch_id
 *               - first_name
 *               - last_name
 *               - gender
 *               - date_of_birth
 *               - admission_number
 *               - address
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *                 example: "f1a3b9a2-6f7d-4b49-9e60-7b6b2b1b6a1a"
 *               branch_id:
 *                 type: string
 *                 format: uuid
 *               first_name:
 *                 type: string
 *                 example: "Sami"
 *               last_name:
 *                 type: string
 *                 example: "Bekele"
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "2012-05-10"
 *               phone:
 *                 type: string
 *                 nullable: true
 *               address:
 *                 type: string
 *                 example: "Addis Ababa"
 *               admission_number:
 *                 type: string
 *                 example: "ADM-2024-001"
 *     responses:
 *       201:
 *         description: Student created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student created
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     admission_number:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     branch_id:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       501:
 *         description: Not implemented
 */

export const studentRouter = Router();

studentRouter.post(
  '/',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createStudent
);

studentRouter.post(
  '/register',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  registerStudent
);
