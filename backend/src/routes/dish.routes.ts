import { Router } from 'express';
import * as dishController from '../controllers/dish.controller';
import { authenticate, authorize } from '../middleware';
import { Role } from '../types/enums';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(authorize(Role.SUPER_ADMIN, Role.CAFE_ADMIN));

router.post('/', dishController.create);
router.get('/', dishController.getAll);
router.get('/:id', dishController.getById);
router.put('/:id', dishController.update);
router.delete('/:id', dishController.remove);

export default router;