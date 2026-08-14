import { Router } from 'express';
import * as menuController from '../controllers/menu.controller';

const router = Router();

router.get('/:cafeSlug/categories/:categoryId/dishes', menuController.getCategoryDishes);
router.get('/:cafeSlug', menuController.getMenu);

export default router;