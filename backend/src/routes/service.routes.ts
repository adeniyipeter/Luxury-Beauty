import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';

const router = Router();

router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getOne);
router.post('/', authenticate, requireRole('ADMIN'), validate(createServiceSchema), serviceController.create);
router.patch('/:id', authenticate, requireRole('ADMIN'), validate(updateServiceSchema), serviceController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), serviceController.delete);

export default router;
