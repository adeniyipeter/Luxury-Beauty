import { Router } from 'express';
import authRoutes from './auth.routes';
import serviceRoutes from './service.routes';
import categoryRoutes from './category.routes';
import staffRoutes, { availabilityRouter } from './staff.routes';
import appointmentRoutes from './appointment.routes';
import reviewRoutes from './review.routes';
import galleryRoutes from './gallery.routes';
import { promotionRouter, notificationRouter, settingsRouter, reportRouter } from './misc.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', authRoutes); // supports /users/me
router.use('/services', serviceRoutes);
router.use('/categories', categoryRoutes);
router.use('/staff', staffRoutes);
router.use('/availability', availabilityRouter);
router.use('/appointments', appointmentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/gallery', galleryRoutes);
router.use('/promotions', promotionRouter);
router.use('/notifications', notificationRouter);
router.use('/settings', settingsRouter);
router.use('/reports', reportRouter);

export default router;
