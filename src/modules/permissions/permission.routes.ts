import { Router, Request, Response } from 'express';

/**
 * @openapi
 * tags:
 *   - name: Permissions
 *     description: Permission management
 */

/**
 * @openapi
 * /api/permissions:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: List permissions
 *     description: Not implemented
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
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
 *                   name:
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

export const permissionRouter = Router();

permissionRouter.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented' });
});
