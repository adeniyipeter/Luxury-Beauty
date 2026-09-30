import { Router } from 'express';
import {
  promotionController,
  notificationController,
  settingsController,
  reportController,
} from '../controllers/misc.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const promotionRouter = Router();
promotionRouter.get('/', promotionController.getAll);
promotionRouter.get('/validate/:code', promotionController.validateCode);
promotionRouter.post('/', authenticate, requireRole('ADMIN'), promotionController.create);

export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get('/', notificationController.getAll);
notificationRouter.patch('/:id/read', notificationController.markAsRead);
notificationRouter.post('/read-all', notificationController.markAllAsRead);

export const settingsRouter = Router();
settingsRouter.get('/', settingsController.getAll);
settingsRouter.post('/', authenticate, requireRole('ADMIN'), settingsController.update);

export const reportRouter = Router();
reportRouter.get('/dashboard', authenticate, requireRole('ADMIN'), reportController.getDashboard);
