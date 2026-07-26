import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

type CafeParams = { cafeId: string };
type CategoryParams = { cafeId: string; id: string };

export const create = async (req: Request<CafeParams>, res: Response, next: NextFunction) => {
  try {
    const { name, description, displayOrder } = req.body;
    const category = await categoryService.createCategory(
      name, req.params.cafeId, req.user!.userId, req.user!.role,
      { description, displayOrder }
    );
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request<CafeParams>, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getCategoriesByCafe(
      req.params.cafeId, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request<CategoryParams>, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategoryById(
      req.params.cafeId, req.params.id, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request<CategoryParams>, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.cafeId, req.params.id, req.body, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request<CategoryParams>, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(
      req.params.cafeId, req.params.id, req.user!.userId, req.user!.role
    );
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};