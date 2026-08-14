import { Request, Response, NextFunction } from 'express';
import * as menuService from '../services/menu.service';

type MenuParams = { cafeSlug: string };
type CategoryDishesParams = { cafeSlug: string; categoryId: string };

export const getMenu = async (req: Request<MenuParams>, res: Response, next: NextFunction) => {
  try {
    const dishLimit = parseInt(req.query.dishLimit as string) || undefined;
    const menu = await menuService.getPublicMenu(req.params.cafeSlug, dishLimit);
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

export const getCategoryDishes = async (req: Request<CategoryDishesParams>, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const { dishes, pagination } = await menuService.getCategoryDishes(
      req.params.cafeSlug, req.params.categoryId, page, limit
    );
    res.status(200).json({ success: true, data: dishes, pagination });
  } catch (error) {
    next(error);
  }
};