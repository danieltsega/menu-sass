import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

type IdParams = { id: string };

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const { users, pagination } = await userService.getUsers(page, limit);
    res.status(200).json({ success: true, data: users, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};