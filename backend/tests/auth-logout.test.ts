import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../src/services/auth.service';

const mockUser = vi.hoisted(() => ({
  findOne: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
}));

const mockBlacklistedToken = vi.hoisted(() => ({
  findOne: vi.fn(),
  create: vi.fn(),
}));

vi.mock('../src/models', () => ({
  User: mockUser,
  BlacklistedToken: mockBlacklistedToken,
}));

vi.mock('../src/config', () => ({
  default: {
    jwtSecret: 'test-secret',
    jwtRefreshSecret: 'test-refresh-secret',
    jwtExpiresIn: '15m',
    jwtRefreshExpiresIn: '7d',
  },
}));

describe('Auth Service — Logout & Refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logout', () => {
    it('should blacklist a valid refresh token', async () => {
      mockBlacklistedToken.create.mockResolvedValue({});

      await authService.logout(validRefreshToken());
      expect(mockBlacklistedToken.create).toHaveBeenCalledOnce();
    });
  });

  describe('refresh with blacklist', () => {
    it('should throw if token is blacklisted', async () => {
      mockBlacklistedToken.findOne.mockResolvedValue({ token: 'hashed' });

      await expect(authService.refresh(validRefreshToken())).rejects.toThrow('Token has been revoked');
    });

    it('should succeed if token is not blacklisted', async () => {
      mockBlacklistedToken.findOne.mockResolvedValue(null);
      mockUser.findById.mockResolvedValue({ _id: 'test-id', isActive: true, role: 'super_admin' });

      const result = await authService.refresh(validRefreshToken());
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });
  });
});

const validRefreshToken = () => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ userId: 'test-id', role: 'super_admin' }, 'test-refresh-secret', { expiresIn: '7d' });
};