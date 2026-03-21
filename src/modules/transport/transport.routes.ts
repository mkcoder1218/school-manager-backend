import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createRoute,
  createAssignment,
  createVehicle,
  deleteRoute,
  deleteVehicle,
  listRoutes,
  listAssignments,
  listVehicles,
  updateRoute,
  updateVehicle,
} from './transport.controller';

export const transportRouter = Router();

/**
 * @openapi
 * /api/transport/routes:
 *   get:
 *     tags:
 *       - Transport
 *     summary: List transport routes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Route list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transportRouter.get(
  '/transport/routes',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  listRoutes
);
/**
 * @openapi
 * /api/transport/routes:
 *   post:
 *     tags:
 *       - Transport
 *     summary: Create transport route
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, name, start_location, end_location, stops]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               start_location:
 *                 type: string
 *               end_location:
 *                 type: string
 *               stops:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Route created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transportRouter.post(
  '/transport/routes',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createRoute
);
/**
 * @openapi
 * /api/transport/routes/{route_id}:
 *   put:
 *     tags:
 *       - Transport
 *     summary: Update transport route
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: route_id
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
 *               name:
 *                 type: string
 *               start_location:
 *                 type: string
 *               end_location:
 *                 type: string
 *               stops:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Route updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Route not found
 */
transportRouter.put(
  '/transport/routes/:route_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  updateRoute
);
/**
 * @openapi
 * /api/transport/routes/{route_id}:
 *   delete:
 *     tags:
 *       - Transport
 *     summary: Delete transport route
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: route_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Route deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Route not found
 */
transportRouter.delete(
  '/transport/routes/:route_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  deleteRoute
);

/**
 * @openapi
 * /api/transport/vehicles:
 *   get:
 *     tags:
 *       - Transport
 *     summary: List vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transportRouter.get(
  '/transport/vehicles',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  listVehicles
);
/**
 * @openapi
 * /api/transport/vehicles:
 *   post:
 *     tags:
 *       - Transport
 *     summary: Create vehicle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, route_id, vehicle_number, capacity, driver_name, status]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               route_id:
 *                 type: string
 *                 format: uuid
 *               vehicle_number:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               driver_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Vehicle created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transportRouter.post(
  '/transport/vehicles',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createVehicle
);
/**
 * @openapi
 * /api/transport/vehicles/{vehicle_id}:
 *   put:
 *     tags:
 *       - Transport
 *     summary: Update vehicle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
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
 *               route_id:
 *                 type: string
 *                 format: uuid
 *               vehicle_number:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               driver_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 */
transportRouter.put(
  '/transport/vehicles/:vehicle_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  updateVehicle
);
/**
 * @openapi
 * /api/transport/vehicles/{vehicle_id}:
 *   delete:
 *     tags:
 *       - Transport
 *     summary: Delete vehicle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vehicle deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 */
transportRouter.delete(
  '/transport/vehicles/:vehicle_id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  deleteVehicle
);

/**
 * @openapi
 * /api/transport/assignments:
 *   post:
 *     tags:
 *       - Transport
 *     summary: Assign student to transport
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school_id, student_id, route_id, vehicle_id]
 *             properties:
 *               school_id:
 *                 type: string
 *                 format: uuid
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               route_id:
 *                 type: string
 *                 format: uuid
 *               vehicle_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Assignment created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transportRouter.post(
  '/transport/assignments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createAssignment
);
/**
 * @openapi
 * /api/transport/assignments:
 *   get:
 *     tags:
 *       - Transport
 *     summary: List transport assignments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transportRouter.get(
  '/transport/assignments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  listAssignments
);
