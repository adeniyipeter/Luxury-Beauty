import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole, AppError } from '../types';

export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized: Please authenticate first.', 401));
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Forbidden: Access denied. Required role: ${roles.join(' or ')}`, 403));
    }

    next();
  };
};
