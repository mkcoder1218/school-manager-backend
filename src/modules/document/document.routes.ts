import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { createDocument, documentUpload, uploadDocumentFile } from './document.controller';

export const documentRouter = Router();

documentRouter.post(
  '/documents/upload',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  documentUpload.single('file'),
  uploadDocumentFile
);

documentRouter.post(
  '/documents',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin', 'registrar'),
  documentUpload.single('file'),
  createDocument
);
