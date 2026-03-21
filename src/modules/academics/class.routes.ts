import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createClass,
  deleteClass,
  getClass,
  listClasses,
  updateClass,
} from './class.controller';

export const classRouter = Router();

classRouter.post(
  '/classes',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createClass
);
classRouter.get(
  '/classes',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  listClasses
);
classRouter.get(
  '/classes/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  getClass
);
classRouter.patch(
  '/classes/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  updateClass
);
classRouter.delete(
  '/classes/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  deleteClass
);
