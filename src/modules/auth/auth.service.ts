import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthUser, JwtPayload } from './auth.types';
import { env } from '../../config/env';

const JWT_SECRET = env.jwtSecret;
const SALT_ROUNDS = 10;

export interface RegisterInput {
  email: string;
  password: string;
  school_id: string | null;
}

export interface LoginResult {
  token: string;
}

export const registerUser = async (input: RegisterInput): Promise<{
  email: string;
  passwordHash: string;
  school_id: string | null;
}> => {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  return {
    email: input.email,
    passwordHash,
    school_id: input.school_id,
  };
};

export const loginUser = async (
  user: AuthUser,
  password: string,
  roles: string[] = [],
  permissions: string[] = []
): Promise<LoginResult> => {
  // eslint-disable-next-line no-console
  console.log(`Login attempt for ${user.email}`);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    // eslint-disable-next-line no-console
    console.log(`Login failed for ${user.email}`);
    throw new Error('Invalid credentials');
  }

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload: JwtPayload = {
    sub: user.id,
    school_id: user.school_id,
    roles,
    permissions,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
  return { token };
};

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Missing or invalid authorization header' });
      return;
    }

    if (!JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret is not configured' });
      return;
    }

    const token = authHeader.substring('Bearer '.length);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.auth = decoded;
    req.userId = decoded.sub;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
