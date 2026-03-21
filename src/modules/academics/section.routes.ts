import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  createSection,
  deleteSection,
  getSection,
  listSections,
  updateSection,
} from './section.controller';

export const sectionRouter = Router();

sectionRouter.post(
  '/sections',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  createSection
);
sectionRouter.get(
  '/sections',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  listSections
);
sectionRouter.get(
  '/sections/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  getSection
);
sectionRouter.patch(
  '/sections/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  updateSection
);
sectionRouter.delete(
  '/sections/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  deleteSection
);
