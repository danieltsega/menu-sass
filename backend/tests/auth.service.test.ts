import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUser = vi.hoisted(() => ({
  findOne: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
}));

vi.mock('../src/models', () => ({
  User: mockUser,
}));

vi.mock('../src/config', () => ({
  default: {
    jwtSecret: 'test-secret',
    jwtRefreshSecret: 'test-refresh-secret',
    jwtExpiresIn: '15m',
    jwtRefreshExpiresIn: '7d',
  },
}));

import * as authService from '../src/services/auth.service';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUser.findOne.mockResolvedValue(null);
      mockUser.create.mockResolvedValue({
        _id: 'test-uuid',
        name: 'Test User',
        email: 'test@cafe.com',
        role: 'cafe_admin' as const,
      });

      const result = await authService.register('Test User', 'test@cafe.com', 'password123', 'cafe_admin' as any);

      expect(result.user.name).toBe('Test User');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw if email already exists', async () => {
      mockUser.findOne.mockResolvedValue({ _id: 'existing-id' });

      await expect(
        authService.register('Test', 'existing@cafe.com', 'password123', 'cafe_admin' as any)
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      mockUser.findOne.mockResolvedValue(null);
      await expect(authService.login('noone@cafe.com', 'password123')).rejects.toThrow('Invalid email or password');
    });

    it('should throw if password is wrong', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'test-id',
        isActive: true,
        comparePassword: vi.fn().mockResolvedValue(false),
      });
      await expect(authService.login('test@cafe.com', 'wrongpass')).rejects.toThrow('Invalid email or password');
    });

    it('should login successfully', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'test-id',
        role: 'cafe_admin',
        isActive: true,
        comparePassword: vi.fn().mockResolvedValue(true),
      });
      const result = await authService.login('test@cafe.com', 'correctpass');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('should throw for invalid token', async () => {
      await expect(authService.refresh('bad-token')).rejects.toThrow();
    });
  });
});