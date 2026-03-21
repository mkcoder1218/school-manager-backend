import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { createUser, getUserMessages, getMe, listUsers } from './user.controller';

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Platform and school user management
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   email:
 *                     type: string
 *       501:
 *         description: Not implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not implemented
 */

export const userRouter = Router();

userRouter.get('/', authenticateJWT, authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'), listUsers);

userRouter.get('/me', authenticateJWT, getMe);

userRouter.post(
  '/',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal'),
  createUser
);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - phone
 *               - role
 *               - school_id
 *               - branch_id
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: teacher
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               branch_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     branch_id:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
userRouter.get(
  '/:user_id/messages',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'school_principal', 'teacher'),
  getUserMessages
);

/**
 * @openapi
 * /api/users/{user_id}/messages:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user message counts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     sent:
 *                       type: integer
 *                     received:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
