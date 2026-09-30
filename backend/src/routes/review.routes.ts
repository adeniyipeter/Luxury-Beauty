import { Router } from 'express';
import { reviewController } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createReviewSchema } from '../validators/appointment.validator';

const router = Router();

router.get('/', reviewController.getAll);
router.post('/', authenticate, validate(createReviewSchema), reviewController.create);
router.patch('/:id/status', authenticate, requireRole('ADMIN'), reviewController.updateStatus);
router.delete('/:id', authenticate, requireRole('ADMIN'), reviewController.delete);

export default router;
