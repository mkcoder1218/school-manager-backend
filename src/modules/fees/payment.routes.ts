import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { getPayment, listPayments, recordPayment } from './payment.controller';

export const paymentRouter = Router();

paymentRouter.post(
  '/payments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  recordPayment
);
paymentRouter.get(
  '/payments',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  listPayments
);
paymentRouter.get(
  '/payments/:id',
  authenticateJWT,
  authorizeRoles('super_admin', 'school_owner', 'school_admin'),
  getPayment
);
