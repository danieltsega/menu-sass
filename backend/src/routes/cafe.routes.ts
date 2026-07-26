import { Router } from 'express';
import * as cafeController from '../controllers/cafe.controller';
import { authenticate, authorize } from '../middleware';
import { Role } from '../types/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SUPER_ADMIN));

router.post('/', cafeController.create);
router.get('/', cafeController.getAll);
router.get('/:id', cafeController.getById);
router.put('/:id', cafeController.update);
router.delete('/:id', cafeController.remove);

export default router;