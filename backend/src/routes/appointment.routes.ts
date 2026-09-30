import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
} from '../validators/appointment.validator';

const router = Router();

router.use(authenticate);

router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getOne);
router.post('/', validate(createAppointmentSchema), appointmentController.book);
router.patch('/:id/status', requireRole(['ADMIN', 'STAFF']), validate(updateAppointmentStatusSchema), appointmentController.updateStatus);
router.post('/:id/cancel', appointmentController.cancel);
router.post('/:id/confirm', requireRole(['ADMIN', 'STAFF']), appointmentController.confirm);
router.post('/:id/complete', requireRole(['ADMIN', 'STAFF']), appointmentController.complete);
router.post('/:id/reschedule', validate(rescheduleAppointmentSchema), appointmentController.reschedule);

export default router;
