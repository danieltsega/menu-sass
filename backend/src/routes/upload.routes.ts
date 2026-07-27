import { Router } from 'express';
import { upload } from '../middleware/upload';
import * as uploadController from '../controllers/upload.controller';
import { authenticate, authorize } from '../middleware';
import { Role } from '../types/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SUPER_ADMIN, Role.CAFE_ADMIN));

router.post('/', upload.single('image'), uploadController.uploadImage);

export default router;