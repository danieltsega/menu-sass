import { Request, Response, NextFunction } from 'express';

export const uploadImage = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file provided' });
      return;
    }

    const url = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: { url } });
  } catch (error) {
    next(error);
  }
};