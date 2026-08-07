import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUser = vi.hoisted(() => ({
  findOne: vi.fn(),
  find: vi.fn(() => ({
    sort: vi.fn(() => ({
      skip: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue([]),
      })),
    })),
  })),
  countDocuments: vi.fn().mockResolvedValue(0),
  findById: vi.fn(),
  findByIdAndDelete: vi.fn(),
  create: vi.fn(),
}));

vi.mock('../src/models', () => ({
  User: mockUser,
}));

import * as userService from '../src/services/user.service';

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const users = [{ _id: '1', name: 'A' }, { _id: '2', name: 'B' }];
      const sortChain = { skip: vi.fn(() => ({ limit: vi.fn().mockResolvedValue(users) })) };
      mockUser.find.mockReturnValue({ sort: vi.fn(() => sortChain) });
      mockUser.countDocuments.mockResolvedValue(10);

      const result = await userService.getUsers(1, 2);
      expect(result.users).toHaveLength(2);
      expect(result.pagination.total).toBe(10);
    });

    it('should exclude the requesting user when excludeId is provided', async () => {
      const sortChain = { skip: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([]) })) };
      mockUser.find.mockReturnValue({ sort: vi.fn(() => sortChain) });
      mockUser.countDocuments.mockResolvedValue(3);

      await userService.getUsers(1, 10, 'self-id');
      expect(mockUser.find).toHaveBeenCalledWith({ _id: { $ne: 'self-id' } });
      expect(mockUser.countDocuments).toHaveBeenCalledWith({ _id: { $ne: 'self-id' } });
    });

    it('should not exclude anyone when excludeId is omitted', async () => {
      const sortChain = { skip: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([]) })) };
      mockUser.find.mockReturnValue({ sort: vi.fn(() => sortChain) });

      await userService.getUsers(1, 10);
      expect(mockUser.find).toHaveBeenCalledWith({});
      expect(mockUser.countDocuments).toHaveBeenCalledWith({});
    });
  });

  describe('createUser', () => {
    it('should throw if email already exists', async () => {
      mockUser.findOne.mockResolvedValue({ _id: 'existing' });
      await expect(
        userService.createUser({ name: 'T', email: 'dup@cafe.com', password: 'pass123', role: 'cafe_admin' as any })
      ).rejects.toThrow('Email already in use');
    });

    it('should create a user', async () => {
      mockUser.findOne.mockResolvedValue(null);
      mockUser.create.mockResolvedValue({ _id: 'new', email: 'new@cafe.com' });
      const result = await userService.createUser({ name: 'T', email: 'new@cafe.com', password: 'pass123', role: 'cafe_admin' as any });
      expect(result._id).toBe('new');
    });
  });

  describe('updateUser', () => {
    it('should throw if user not found', async () => {
      mockUser.findById.mockResolvedValue(null);
      await expect(userService.updateUser('bad-id', { name: 'X' })).rejects.toThrow('User not found');
    });

    it('should throw if email already taken by another user', async () => {
      mockUser.findById.mockResolvedValue({ _id: 'id', email: 'me@cafe.com' });
      mockUser.findOne.mockResolvedValue({ _id: 'other' });
      await expect(userService.updateUser('id', { email: 'taken@cafe.com' })).rejects.toThrow('Email already in use');
    });

    it('should update user fields and save', async () => {
      const save = vi.fn().mockResolvedValue({});
      mockUser.findById.mockResolvedValue({ _id: 'id', email: 'me@cafe.com', save });
      mockUser.findOne.mockResolvedValue(null);
      const result = await userService.updateUser('id', { name: 'New Name', role: 'super_admin' as any });
      expect(save).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });
  });

  describe('deleteUser', () => {
    it('should throw if user not found', async () => {
      mockUser.findByIdAndDelete.mockResolvedValue(null);
      await expect(userService.deleteUser('bad-id')).rejects.toThrow('User not found');
    });

    it('should delete a user', async () => {
      mockUser.findByIdAndDelete.mockResolvedValue({ _id: 'id' });
      const result = await userService.deleteUser('id');
      expect(result._id).toBe('id');
    });
  });
});