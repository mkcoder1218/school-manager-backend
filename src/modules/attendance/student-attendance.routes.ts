import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createStudentAttendance,
  deleteStudentAttendance,
  getStudentAttendance,
  listStudentAttendance,
  updateStudentAttendance,
} from './student-attendance.controller';

export const studentAttendanceRouter = Router();

/**
 * @openapi
 * /api/student-attendance:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Create student attendance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id, class_id, section_id, date, status]
 *             properties:
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               class_id:
 *                 type: string
 *                 format: uuid
 *               section_id:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [present, absent, late, excused]
 *     responses:
 *       201:
 *         description: Attendance created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
studentAttendanceRouter.post(
  '/student-attendance',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  createStudentAttendance
);
/**
 * @openapi
 * /api/student-attendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: List student attendance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
studentAttendanceRouter.get(
  '/student-attendance',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  listStudentAttendance
);
/**
 * @openapi
 * /api/student-attendance/{id}:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get student attendance
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
 *         description: Attendance details
 *       404:
 *         description: Attendance not found
 */
studentAttendanceRouter.get(
  '/student-attendance/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  getStudentAttendance
);
/**
 * @openapi
 * /api/student-attendance/{id}:
 *   patch:
 *     tags:
 *       - Attendance
 *     summary: Update student attendance
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
 *               status:
 *                 type: string
 *                 enum: [present, absent, late, excused]
 *     responses:
 *       200:
 *         description: Attendance updated
 *       404:
 *         description: Attendance not found
 */
studentAttendanceRouter.patch(
  '/student-attendance/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  updateStudentAttendance
);
/**
 * @openapi
 * /api/student-attendance/{id}:
 *   delete:
 *     tags:
 *       - Attendance
 *     summary: Delete student attendance
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
 *         description: Attendance deleted
 *       404:
 *         description: Attendance not found
 */
studentAttendanceRouter.delete(
  '/student-attendance/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  deleteStudentAttendance
);
