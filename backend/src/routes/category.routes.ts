import { Router } from 'express';
import { categoryController } from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/service.validator';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.post('/', authenticate, requireRole('ADMIN'), validate(createCategorySchema), categoryController.create);
router.patch('/:id', authenticate, requireRole('ADMIN'), validate(updateCategorySchema), categoryController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), categoryController.delete);

export default router;
