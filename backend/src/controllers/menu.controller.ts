import { Request, Response, NextFunction } from 'express';
import * as menuService from '../services/menu.service';

type MenuParams = { cafeSlug: string };

export const getMenu = async (req: Request<MenuParams>, res: Response, next: NextFunction) => {
  try {
    const menu = await menuService.getPublicMenu(req.params.cafeSlug);
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};