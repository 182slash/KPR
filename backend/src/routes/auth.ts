import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import prisma from '../config/db';
import { authGuard, type AuthRequest } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';

const router = Router();

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_AUTH,
  message: { message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /v1/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    // Prevent timing attacks — still hash compare
    await bcrypt.compare(password, '$2b$12$invalidhashfortimingprevention000000000000000');
    throw new AppError('Invalid credentials', 401);
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  // Update last login
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  res.json({
    data: {
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    },
  });
});

// GET /v1/auth/me
router.get('/me', authGuard, async (req: AuthRequest, res) => {
  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin!.id },
    select: { id: true, email: true, name: true, role: true, lastLoginAt: true, createdAt: true },
  });
  if (!admin) throw new AppError('Admin not found', 404);
  res.json({ data: admin });
});

// POST /v1/auth/logout (stateless JWT — client discards token)
router.post('/logout', authGuard, (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// POST /v1/auth/change-password
router.post('/change-password', authGuard, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }).parse(req.body);

  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.id } });
  if (!admin) throw new AppError('Admin not found', 404);

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) throw new AppError('Current password is incorrect', 400);

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } });

  res.json({ message: 'Password changed successfully' });
});

export default router;
