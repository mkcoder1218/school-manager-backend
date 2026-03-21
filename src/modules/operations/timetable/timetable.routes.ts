import { Router } from 'express';
import { authenticateJWT } from '../../../middlewares/auth.middleware';
import { authorizeRoles } from '../../../middlewares/rbac.middleware';
import {
  createTimetable,
  deleteTimetable,
  getTimetable,
  listTimetable,
  updateTimetable,
} from './timetable.controller';

export const timetableRouter = Router();

/**
 * @openapi
 * /api/timetable:
 *   post:
 *     tags:
 *       - Timetable
 *     summary: Create timetable entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, class_id, section_id, subject_id, teacher_id, day, start_time, end_time]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               class_id:
 *                 type: string
 *                 format: uuid
 *               section_id:
 *                 type: string
 *                 format: uuid
 *               subject_id:
 *                 type: string
 *                 format: uuid
 *               teacher_id:
 *                 type: string
 *                 format: uuid
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               exam_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Timetable entry created
 *       400:
 *         description: Validation error
 */
timetableRouter.post(
  '/timetable',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  createTimetable
);
/**
 * @openapi
 * /api/timetable:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: List timetable entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timetable list
 */
timetableRouter.get(
  '/timetable',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  listTimetable
);
/**
 * @openapi
 * /api/timetable/{id}:
 *   get:
 *     tags:
 *       - Timetable
 *     summary: Get timetable entry
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
 *         description: Timetable details
 *       404:
 *         description: Timetable entry not found
 */
timetableRouter.get(
  '/timetable/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  getTimetable
);
/**
 * @openapi
 * /api/timetable/{id}:
 *   patch:
 *     tags:
 *       - Timetable
 *     summary: Update timetable entry
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
 *               subject_id:
 *                 type: string
 *                 format: uuid
 *               teacher_id:
 *                 type: string
 *                 format: uuid
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               exam_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Timetable updated
 *       404:
 *         description: Timetable entry not found
 */
timetableRouter.patch(
  '/timetable/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  updateTimetable
);
/**
 * @openapi
 * /api/timetable/{id}:
 *   delete:
 *     tags:
 *       - Timetable
 *     summary: Delete timetable entry
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
 *         description: Timetable deleted
 *       404:
 *         description: Timetable entry not found
 */
timetableRouter.delete(
  '/timetable/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  deleteTimetable
);
