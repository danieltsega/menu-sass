import { describe, it, expect, vi } from 'vitest';
import { sanitize } from '../src/middleware/sanitize';

describe('sanitize middleware', () => {
  it('should preserve string values like emails and urls', () => {
    const req = {
      body: {
        email: 'cafe@brewbean.com',
        image: 'https://cdn.example.com/uploads/logo.png',
        description: 'Fresh, daily. $pecial & dot.ted',
      },
    } as any;
    const next = vi.fn();

    sanitize(req, {} as any, next);

    expect(req.body.email).toBe('cafe@brewbean.com');
    expect(req.body.image).toBe('https://cdn.example.com/uploads/logo.png');
    expect(req.body.description).toBe('Fresh, daily. $pecial & dot.ted');
    expect(next).toHaveBeenCalled();
  });

  it('should strip $ and . from object keys to prevent NoSQL injection', () => {
    const req = {
      body: {
        $where: '1=1',
        'email.$gt': 'x',
        safe: 'value',
      },
    } as any;
    const next = vi.fn();

    sanitize(req, {} as any, next);

    expect(req.body).toEqual({ where: '1=1', emailgt: 'x', safe: 'value' });
    expect(next).toHaveBeenCalled();
  });

  it('should recursively sanitize keys in nested objects and arrays', () => {
    const req = {
      body: {
        items: [{ '$push': 1 }, { $set: { 'a.b': 2 } }],
      },
    } as any;
    const next = vi.fn();

    sanitize(req, {} as any, next);

    expect(req.body.items).toEqual([{ push: 1 }, { set: { ab: 2 } }]);
    expect(next).toHaveBeenCalled();
  });
});