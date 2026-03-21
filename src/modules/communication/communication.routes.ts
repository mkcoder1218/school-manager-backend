import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createAnnouncement,
  deleteAnnouncement,
  listMessages,
  listAnnouncements,
  sendMessage,
  updateAnnouncement,
} from './communication.controller';

export const communicationRouter = Router();

/**
 * @openapi
 * /api/announcements:
 *   get:
 *     tags:
 *       - Communication
 *     summary: List announcements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcement list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
communicationRouter.get(
  '/announcements',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  listAnnouncements
);
/**
 * @openapi
 * /api/announcements:
 *   post:
 *     tags:
 *       - Communication
 *     summary: Create announcement
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, message, school_id]
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               school_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Announcement created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
communicationRouter.post(
  '/announcements',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  createAnnouncement
);
/**
 * @openapi
 * /api/announcements/{announcement_id}:
 *   put:
 *     tags:
 *       - Communication
 *     summary: Update announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: announcement_id
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
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Announcement updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Announcement not found
 */
communicationRouter.put(
  '/announcements/:announcement_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  updateAnnouncement
);
/**
 * @openapi
 * /api/announcements/{announcement_id}:
 *   delete:
 *     tags:
 *       - Communication
 *     summary: Delete announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: announcement_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Announcement deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Announcement not found
 */
communicationRouter.delete(
  '/announcements/:announcement_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  deleteAnnouncement
);

/**
 * @openapi
 * /api/messages:
 *   post:
 *     tags:
 *       - Communication
 *     summary: Send message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiver_id, content]
 *             properties:
 *               receiver_id:
 *                 type: string
 *                 format: uuid
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
communicationRouter.post(
  '/messages',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  sendMessage
);

communicationRouter.get(
  '/messages',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher', 'student'),
  listMessages
);
