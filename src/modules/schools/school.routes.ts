import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { createSchool, listSchools, updateSchool } from './school.controller';

export const schoolRouter = Router();

schoolRouter.post('/schools', authenticateJWT, authorizeRoles('super_admin'), createSchool);
schoolRouter.get('/schools', authenticateJWT, authorizeRoles('super_admin'), listSchools);
schoolRouter.put('/schools/:id', authenticateJWT, authorizeRoles('super_admin'), updateSchool);

/**
 * @openapi
 * /api/schools:
 *   post:
 *     tags:
 *       - Schools
 *     summary: Create school
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               owner:
 *                 type: object
 *                 required: [first_name, last_name, email, password]
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   password:
 *                     type: string
 *                     format: password
 *     responses:
 *       201:
 *         description: School and owner created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Owner email already exists
 */
