import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize, validate } from '../middleware';
import { createUserSchema, updateUserSchema } from '../validators';
import { Role } from '../types/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SUPER_ADMIN));

router.post('/', validate(createUserSchema), userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;