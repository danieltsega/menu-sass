import { Request, Response, NextFunction } from 'express';
import * as cafeService from '../services/cafe.service';

type IdParams = { id: string };

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, admin, description, address, phone } = req.body;
    const cafe = await cafeService.createCafe(name, slug, admin, { description, address, phone });
    res.status(201).json({ success: true, data: cafe });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cafes = await cafeService.getAllCafes();
    res.status(200).json({ success: true, data: cafes });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    const cafe = await cafeService.getCafeById(req.params.id);
    res.status(200).json({ success: true, data: cafe });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    const cafe = await cafeService.updateCafe(req.params.id, req.body);
    res.status(200).json({ success: true, data: cafe });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    await cafeService.deleteCafe(req.params.id);
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};