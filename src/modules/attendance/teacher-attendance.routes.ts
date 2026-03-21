import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createTeacherAttendance,
  deleteTeacherAttendance,
  getTeacherAttendance,
  listTeacherAttendance,
  updateTeacherAttendance,
} from './teacher-attendance.controller';

export const teacherAttendanceRouter = Router();

/**
 * @openapi
 * /api/teacher-attendance:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Create teacher attendance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teacher_id, date, status]
 *             properties:
 *               teacher_id:
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
teacherAttendanceRouter.post(
  '/teacher-attendance',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  createTeacherAttendance
);
/**
 * @openapi
 * /api/teacher-attendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: List teacher attendance
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
teacherAttendanceRouter.get(
  '/teacher-attendance',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  listTeacherAttendance
);
/**
 * @openapi
 * /api/teacher-attendance/{id}:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get teacher attendance
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
teacherAttendanceRouter.get(
  '/teacher-attendance/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  getTeacherAttendance
);
/**
 * @openapi
 * /api/teacher-attendance/{id}:
 *   patch:
 *     tags:
 *       - Attendance
 *     summary: Update teacher attendance
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
teacherAttendanceRouter.patch(
  '/teacher-attendance/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  updateTeacherAttendance
);
/**
 * @openapi
 * /api/teacher-attendance/{id}:
 *   delete:
 *     tags:
 *       - Attendance
 *     summary: Delete teacher attendance
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
teacherAttendanceRouter.delete(
  '/teacher-attendance/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar', 'teacher'),
  deleteTeacherAttendance
);
