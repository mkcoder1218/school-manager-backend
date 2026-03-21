import { Request, Response, NextFunction } from 'express';

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const permissions = req.auth?.permissions || [];

    // eslint-disable-next-line no-console
    console.log(`Permission check: ${permission} for user ${req.userId || 'unknown'}`);

    if (!permissions.includes(permission)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const roles = req.auth?.roles || [];

    // eslint-disable-next-line no-console
    console.log(`Role check: ${role} for user ${req.userId || 'unknown'}`);

    if (!roles.includes(role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};
