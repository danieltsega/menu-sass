import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  const statusCode = err.message.includes('already in use') ? 409
    : err.message.includes('Invalid') ? 401
    : err.message.includes('required') ? 400
    : err.message.includes('not found') ? 404
    : 500;

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
};