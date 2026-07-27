import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File too large (max 5MB)'
      : err.message;
    res.status(400).json({ success: false, error: message });
    return;
  }

  const statusCode = err.message.includes('already in use') ? 409
    : err.message.includes('Invalid') ? 401
    : err.message.includes('required') ? 400
    : err.message.includes('not found') ? 404
    : err.message.includes('Only image files') ? 400
    : 500;

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
};