import { Request, Response } from 'express';

export const listPermissions = (_req: Request, res: Response): void => {
  res.status(501).json({ message: 'Not implemented' });
};
