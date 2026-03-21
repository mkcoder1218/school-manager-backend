import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollment,
  listEnrollments,
} from './enrollment.controller';

export const enrollmentRouter = Router();

enrollmentRouter.post(
  '/enrollments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createEnrollment
);
enrollmentRouter.get(
  '/enrollments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  listEnrollments
);
enrollmentRouter.get(
  '/enrollments/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  getEnrollment
);
enrollmentRouter.delete(
  '/enrollments/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  deleteEnrollment
);
