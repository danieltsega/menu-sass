import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, tokens } = await authService.register(name, email, password, role);
    res.status(201).json({ success: true, data: { user, tokens } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);
    res.status(200).json({ success: true, data: { user, tokens } });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const { user, tokens } = await authService.refresh(refreshToken);
    res.status(200).json({ success: true, data: { user, tokens } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};