import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Prisma known errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      res.status(409).json({ message: 'A record with that value already exists.' });
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({ message: 'Record not found.' });
      return;
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    res.status(422).json({
      message: 'Validation error',
      errors: (err as any).flatten?.().fieldErrors,
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    message:
      env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
