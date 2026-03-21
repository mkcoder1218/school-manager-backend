import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createStudentResult,
  deleteStudentResult,
  getStudentResult,
  listStudentResults,
  updateStudentResult,
} from './student-result.controller';

export const studentResultRouter = Router();

/**
 * @openapi
 * /api/student-results:
 *   post:
 *     tags:
 *       - StudentResults
 *     summary: Create student result
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, student_id, exam_subject_id, score]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               exam_subject_id:
 *                 type: string
 *                 format: uuid
 *               score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Student result created
 *       400:
 *         description: Validation error
 */

studentResultRouter.post(
  '/student-results',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  createStudentResult
);

/**
 * @openapi
 * /api/student-results:
 *   get:
 *     tags:
 *       - StudentResults
 *     summary: List student results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student result list
 */

studentResultRouter.get(
  '/student-results',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  listStudentResults
);

/**
 * @openapi
 * /api/student-results/{id}:
 *   get:
 *     tags:
 *       - StudentResults
 *     summary: Get student result
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
 *         description: Student result details
 *       404:
 *         description: Student result not found
 */

studentResultRouter.get(
  '/student-results/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  getStudentResult
);

/**
 * @openapi
 * /api/student-results/{id}:
 *   put:
 *     tags:
 *       - StudentResults
 *     summary: Update student result
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
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               exam_subject_id:
 *                 type: string
 *                 format: uuid
 *               score:
 *                 type: number
 *     responses:
 *       200:
 *         description: Student result updated
 *       404:
 *         description: Student result not found
 */

studentResultRouter.put(
  '/student-results/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  updateStudentResult
);

/**
 * @openapi
 * /api/student-results/{id}:
 *   delete:
 *     tags:
 *       - StudentResults
 *     summary: Delete student result
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
 *         description: Student result deleted
 *       404:
 *         description: Student result not found
 */

studentResultRouter.delete(
  '/student-results/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  deleteStudentResult
);
