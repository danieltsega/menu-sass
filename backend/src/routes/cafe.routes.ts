import { Router } from 'express';
import * as cafeController from '../controllers/cafe.controller';
import { authenticate, authorize, validate } from '../middleware';
import { createCafeSchema, updateCafeSchema } from '../validators';
import { Role } from '../types/enums';

const router = Router();

router.use(authenticate);

router.get('/me', cafeController.getMyCafe);
router.put('/me', validate(updateCafeSchema), cafeController.updateMyCafe);

router.use(authorize(Role.SUPER_ADMIN));

router.post('/', validate(createCafeSchema), cafeController.create);
router.get('/', cafeController.getAll);
router.get('/:id', cafeController.getById);
router.put('/:id', validate(updateCafeSchema), cafeController.update);
router.delete('/:id', cafeController.remove);

export default router;