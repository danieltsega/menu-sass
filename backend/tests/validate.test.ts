import { describe, it, expect, vi } from 'vitest';
import { validate } from '../src/middleware/validate';
import { z } from 'zod';

describe('validate middleware', () => {
  const schema = z.object({
    email: z.string().email(),
    age: z.number().min(18),
  });

  it('should call next() when valid', () => {
    const middleware = validate(schema);
    const req = { body: { email: 'test@test.com', age: 25 } } as any;
    const res = {} as any;
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.email).toBe('test@test.com');
  });

  it('should return 400 when invalid', () => {
    const middleware = validate(schema);
    const req = { body: { email: 'bad', age: 15 } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Validation failed' })
    );
    expect(next).not.toHaveBeenCalled();
  });
});