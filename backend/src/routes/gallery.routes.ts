import { Router } from 'express';
import { galleryController } from '../controllers/misc.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', galleryController.getAll);
router.post('/', authenticate, requireRole('ADMIN'), galleryController.create);
router.delete('/:id', authenticate, requireRole('ADMIN'), galleryController.delete);

export default router;
