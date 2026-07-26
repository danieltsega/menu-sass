import { Request, Response, NextFunction } from 'express';
import * as dishService from '../services/dish.service';

type CafeParams = { cafeId: string };
type DishParams = { cafeId: string; id: string };

export const create = async (req: Request<CafeParams>, res: Response, next: NextFunction) => {
  try {
    const { name, price, category, description, ingredients, image, isAvailable, isFeatured } = req.body;
    const dish = await dishService.createDish(
      name, price, req.params.cafeId, category, req.user!.userId, req.user!.role,
      { description, ingredients, image, isAvailable, isFeatured }
    );
    res.status(201).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request<CafeParams>, res: Response, next: NextFunction) => {
  try {
    const dishes = await dishService.getDishesByCafe(
      req.params.cafeId, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request<DishParams>, res: Response, next: NextFunction) => {
  try {
    const dish = await dishService.getDishById(
      req.params.cafeId, req.params.id, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request<DishParams>, res: Response, next: NextFunction) => {
  try {
    const dish = await dishService.updateDish(
      req.params.cafeId, req.params.id, req.body, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request<DishParams>, res: Response, next: NextFunction) => {
  try {
    await dishService.deleteDish(
      req.params.cafeId, req.params.id, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};