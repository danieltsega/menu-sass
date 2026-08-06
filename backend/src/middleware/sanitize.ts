import { Request, Response, NextFunction } from 'express';

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
};

const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = key.replace(/[$.]/g, '');
    sanitized[cleanKey] = sanitizeValue(value);
  }
  return sanitized;
};

export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.params) req.params = sanitizeObject(req.params) as typeof req.params;
  next();
};