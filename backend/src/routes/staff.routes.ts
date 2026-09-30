import { Router } from 'express';
import { staffController } from '../controllers/service.controller';
import { availabilityController } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', staffController.getAll);
router.get('/:id', staffController.getOne);
router.patch('/:id', authenticate, requireRole(['ADMIN', 'STAFF']), staffController.update);
router.post('/:id/availability', authenticate, requireRole(['ADMIN', 'STAFF']), staffController.setAvailability);

export const availabilityRouter = Router();
availabilityRouter.get('/slots', availabilityController.getSlots);

export default router;
