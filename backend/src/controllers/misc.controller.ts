import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { galleryService } from '../services/gallery.service';
import { promotionService } from '../services/promotion.service';
import { notificationService } from '../services/notification.service';
import { settingsService } from '../services/settings.service';
import { reportService } from '../services/report.service';

export class GalleryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, isFeatured } = req.query;
      const images = await galleryService.getAll({
        category: category as string,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
      });
      res.status(200).json({ status: 'success', data: { images } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await galleryService.create(req.body);
      res.status(201).json({ status: 'success', data: { image } });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await galleryService.delete(req.params.id);
      res.status(200).json({ status: 'success', message: 'Gallery item deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export class PromotionController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const promotions = await promotionService.getAll();
      res.status(200).json({ status: 'success', data: { promotions } });
    } catch (err) {
      next(err);
    }
  }

  async validateCode(req: Request, res: Response, next: NextFunction) {
    try {
      const promo = await promotionService.validateCode(req.params.code);
      res.status(200).json({ status: 'success', data: { promo } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const promo = await promotionService.create(req.body);
      res.status(201).json({ status: 'success', data: { promo } });
    } catch (err) {
      next(err);
    }
  }
}

export class NotificationController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getUserNotifications(req.user!.userId);
      res.status(200).json({ status: 'success', data: { notifications } });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAsRead(req.params.id, req.user!.userId);
      res.status(200).json({ status: 'success', message: 'Marked as read' });
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAllAsRead(req.user!.userId);
      res.status(200).json({ status: 'success', message: 'All marked as read' });
    } catch (err) {
      next(err);
    }
  }
}

export class SettingsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getAll();
      res.status(200).json({ status: 'success', data: settings });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, description } = req.body;
      const setting = await settingsService.update(key, value, description);
      res.status(200).json({ status: 'success', data: { setting } });
    } catch (err) {
      next(err);
    }
  }
}

export class ReportController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await reportService.getDashboardMetrics();
      res.status(200).json({ status: 'success', data: metrics });
    } catch (err) {
      next(err);
    }
  }
}

export const galleryController = new GalleryController();
export const promotionController = new PromotionController();
export const notificationController = new NotificationController();
export const settingsController = new SettingsController();
export const reportController = new ReportController();
