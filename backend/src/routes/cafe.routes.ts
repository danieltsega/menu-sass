import { Router } from 'express';
import * as cafeController from '../controllers/cafe.controller';
import { authenticate, authorize, validate } from '../middleware';
import { createCafeSchema, updateCafeSchema } from '../validators';
import { Role } from '../types/enums';

const router = Router();

router.use(authenticate);

router.get('/me', cafeController.getMyCafe);
router.put('/me', validate(updateCafeSchema), cafeController.updateMyCafe);

const superOnly = Router();
superOnly.use(authorize(Role.SUPER_ADMIN));

superOnly.post('/', validate(createCafeSchema), cafeController.create);
superOnly.get('/', cafeController.getAll);
superOnly.get('/:id', cafeController.getById);
superOnly.put('/:id', validate(updateCafeSchema), cafeController.update);
superOnly.delete('/:id', cafeController.remove);

router.use(superOnly);

export default router;