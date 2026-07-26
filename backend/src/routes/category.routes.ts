import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize, validate } from '../middleware';
import { createCategorySchema, updateCategorySchema } from '../validators';
import { Role } from '../types/enums';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(authorize(Role.SUPER_ADMIN, Role.CAFE_ADMIN));

router.post('/', validate(createCategorySchema), categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;