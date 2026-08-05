import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCafe = vi.hoisted(() => Object.assign(vi.fn(), {
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
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
}));

vi.mock('../src/models/Cafe', () => ({ default: mockCafe }));

const mockUser = vi.hoisted(() => ({
  find: vi.fn().mockResolvedValue([]),
}));

const mockDish = vi.hoisted(() => ({
  aggregate: vi.fn().mockResolvedValue([]),
}));

vi.mock('../src/models/User', () => ({ default: mockUser }));
vi.mock('../src/models/Dish', () => ({ default: mockDish }));

import * as cafeService from '../src/services/cafe.service';

describe('Cafe Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCafe', () => {
    it('should throw if slug already exists', async () => {
      mockCafe.findOne.mockResolvedValue({ _id: 'existing' });
      await expect(
        cafeService.createCafe('Test', 'dup-slug', 'admin-id')
      ).rejects.toThrow('Cafe slug already exists');
    });
  });

  describe('getCafeById', () => {
    it('should return a cafe', async () => {
      mockCafe.findById.mockResolvedValue({ _id: 'id', name: 'Cafe' });
      const result = await cafeService.getCafeById('id');
      expect(result.name).toBe('Cafe');
    });

    it('should throw if not found', async () => {
      mockCafe.findById.mockResolvedValue(null);
      await expect(cafeService.getCafeById('bad-id')).rejects.toThrow('Cafe not found');
    });
  });

  describe('getAllCafes', () => {
    it('should return paginated cafes', async () => {
      const cafes = [
        { _id: '1', name: 'A', admin: 'u1', toJSON: () => ({ _id: '1', name: 'A', admin: 'u1' }) },
        { _id: '2', name: 'B', admin: 'u2', toJSON: () => ({ _id: '2', name: 'B', admin: 'u2' }) },
      ];
      const sortChain = { skip: vi.fn(() => ({ limit: vi.fn().mockResolvedValue(cafes) })) };
      mockCafe.find.mockReturnValue({ sort: vi.fn(() => sortChain) });
      mockCafe.countDocuments.mockResolvedValue(10);
      mockUser.find.mockResolvedValue([{ _id: 'u1', name: 'Alice' }]);
      mockDish.aggregate.mockResolvedValue([]);

      const result = await cafeService.getAllCafes(1, 2);
      expect(result.cafes).toHaveLength(2);
      expect(result.cafes[0].adminName).toBe('Alice');
      expect(result.pagination.total).toBe(10);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.totalPages).toBe(5);
    });
  });

  describe('getCafeByAdmin', () => {
    it('should return the cafe owned by a user', async () => {
      mockCafe.findOne.mockResolvedValue({ _id: 'id', admin: 'admin-id', name: 'Cafe' });
      const result = await cafeService.getCafeByAdmin('admin-id');
      expect(result._id).toBe('id');
      expect(mockCafe.findOne).toHaveBeenCalledWith({ admin: 'admin-id' });
    });

    it('should throw if not found', async () => {
      mockCafe.findOne.mockResolvedValue(null);
      await expect(cafeService.getCafeByAdmin('admin-id')).rejects.toThrow('Cafe not found');
    });
  });

  describe('updateCafeByAdmin', () => {
    it('should update the cafe owned by a user', async () => {
      mockCafe.findOne.mockResolvedValue({ _id: 'id', admin: 'admin-id' });
      mockCafe.findByIdAndUpdate.mockResolvedValue({ _id: 'id', name: 'Updated' });
      const result = await cafeService.updateCafeByAdmin('admin-id', { name: 'Updated' });
      expect(result.name).toBe('Updated');
      expect(mockCafe.findByIdAndUpdate).toHaveBeenCalledWith(
        'id',
        { name: 'Updated' },
        { new: true, runValidators: true }
      );
    });

    it('should throw if cafe not owned by user', async () => {
      mockCafe.findOne.mockResolvedValue(null);
      await expect(cafeService.updateCafeByAdmin('admin-id', { name: 'X' })).rejects.toThrow('Cafe not found');
    });
  });
});