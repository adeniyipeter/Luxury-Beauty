import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import { config } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || undefined;

  // Handle Prisma unique constraint error
  if (err.code === 'P2002') {
    statusCode = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    message = `A record with this ${target} already exists.`;
  }

  // Handle Prisma record not found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource was not found.';
  }

  if (process.env.NODE_ENV !== 'test' && statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(details ? { details } : {}),
    ...(config.nodeEnv === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
  });
};
