import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import {
  assignStudentFee,
  createFee,
  deleteFee,
  getFee,
  listFees,
  listStudentFees,
  updateFee,
  updateStudentFeeStatus,
} from './fee.controller';

export const feeRouter = Router();

feeRouter.post(
  '/fees',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  createFee
);
feeRouter.get(
  '/fees',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  listFees
);
feeRouter.get(
  '/fees/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  getFee
);
feeRouter.patch(
  '/fees/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  updateFee
);
feeRouter.delete(
  '/fees/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  deleteFee
);

feeRouter.post(
  '/student-fees',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  assignStudentFee
);
feeRouter.get(
  '/student-fees',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  listStudentFees
);
feeRouter.patch(
  '/student-fees/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  updateStudentFeeStatus
);
