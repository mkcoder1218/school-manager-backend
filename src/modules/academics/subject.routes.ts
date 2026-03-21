import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createSubject,
  deleteSubject,
  getSubject,
  listSubjects,
  updateSubject,
} from './subject.controller';

export const subjectRouter = Router();

/**
 * @openapi
 * /api/subjects:
 *   post:
 *     tags:
 *       - Subjects
 *     summary: Create subject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, name]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created
 *       400:
 *         description: Validation error
 */

subjectRouter.post(
  '/subjects',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  createSubject
);

/**
 * @openapi
 * /api/subjects:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: List subjects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subject list
 */

subjectRouter.get(
  '/subjects',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  listSubjects
);

/**
 * @openapi
 * /api/subjects/{id}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get subject
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
 *         description: Subject details
 *       404:
 *         description: Subject not found
 */

subjectRouter.get(
  '/subjects/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  getSubject
);

/**
 * @openapi
 * /api/subjects/{id}:
 *   put:
 *     tags:
 *       - Subjects
 *     summary: Update subject
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject updated
 *       404:
 *         description: Subject not found
 */

subjectRouter.put(
  '/subjects/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  updateSubject
);

/**
 * @openapi
 * /api/subjects/{id}:
 *   delete:
 *     tags:
 *       - Subjects
 *     summary: Delete subject
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
 *         description: Subject deleted
 *       404:
 *         description: Subject not found
 */

subjectRouter.delete(
  '/subjects/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  deleteSubject
);
