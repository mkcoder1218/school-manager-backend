import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../modules/auth/auth.types';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Authentication token missing' });
    return;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Authentication token missing' });
    return;
  }

  try {
    if (!env.jwtSecret) {
      res.status(500).json({ message: 'JWT_SECRET is not configured' });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = {
      user_id: decoded.sub,
      role: decoded.roles?.[0] ?? '',
      school_id: decoded.school_id ?? decoded.schoolId ?? null,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
