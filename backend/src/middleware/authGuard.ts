import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/db';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authGuard(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Malformed token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    // Verify admin still exists in DB
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!admin) {
      res.status(401).json({ message: 'Admin account not found' });
      return;
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(role: 'admin' | 'superadmin') {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    if (role === 'superadmin' && req.admin.role !== 'superadmin') {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
