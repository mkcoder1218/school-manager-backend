import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';

export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const role = req.user?.role;
    const schoolId = req.user?.school_id ?? null;
    const data = await analyticsService.getDashboardAnalytics(userId, role, schoolId);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
