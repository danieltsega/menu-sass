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

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const { cafes, pagination } = await cafeService.getAllCafes(page, limit);
    res.status(200).json({ success: true, data: cafes, pagination });
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

export const getMyCafe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cafe = await cafeService.getCafeByAdmin(req.user!.userId);
    res.status(200).json({ success: true, data: cafe });
  } catch (error) {
    next(error);
  }
};

export const updateMyCafe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cafe = await cafeService.updateCafeByAdmin(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: cafe });
  } catch (error) {
    next(error);
  }
};