import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { getDashboardAnalytics } from './analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/dashboard', authenticateJWT, getDashboardAnalytics);
