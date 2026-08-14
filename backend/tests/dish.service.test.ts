import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Role } from '../src/types/enums';

const mockDish = vi.hoisted(() => Object.assign(vi.fn(), {
  find: vi.fn(),
  findOne: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  findOneAndUpdate: vi.fn(),
  findOneAndDelete: vi.fn(),
  updateOne: vi.fn(),
  countDocuments: vi.fn(),
}));

const mockCafe = vi.hoisted(() => ({
  findById: vi.fn(),
  findOne: vi.fn(),
}));

const mockCategory = vi.hoisted(() => ({
  findOne: vi.fn(),
  find: vi.fn(),
}));

vi.mock('../src/models/Dish', () => ({ default: mockDish }));
vi.mock('../src/models/Cafe', () => ({ default: mockCafe }));
vi.mock('../src/models/Category', () => ({ default: mockCategory }));

import * as dishService from '../src/services/dish.service';

const userId = 'user-1';
const cafeId = 'cafe-1';
const role = Role.CAFE_ADMIN;

const dishFindChain = (resolve: unknown) => ({
  sort: vi.fn(() => ({
    skip: vi.fn(() => ({
      limit: vi.fn().mockResolvedValue(resolve),
    })),
  })),
});

describe('Dish Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCafe.findById.mockResolvedValue({ _id: cafeId, admin: userId });
  });

  describe('createDish', () => {
    it('should assign next displayOrder after the last dish in the category', async () => {
      mockCategory.findOne.mockResolvedValue({ _id: 'cat-1', cafe: cafeId });
      mockDish.findOne.mockReturnValue({ sort: vi.fn().mockResolvedValue({ displayOrder: 4 }) });
      mockDish.create.mockResolvedValue({ _id: 'd1', displayOrder: 5 });

      const dish = await dishService.createDish(
        'Burger', 100, cafeId, 'cat-1', userId, role
      );

      expect(mockDish.create).toHaveBeenCalledWith(
        expect.objectContaining({ cafe: cafeId, category: 'cat-1', displayOrder: 5 })
      );
      expect(dish._id).toBe('d1');
    });

    it('should use displayOrder 0 when the category has no dishes', async () => {
      mockCategory.findOne.mockResolvedValue({ _id: 'cat-1', cafe: cafeId });
      mockDish.findOne.mockReturnValue({ sort: vi.fn().mockResolvedValue(null) });
      mockDish.create.mockResolvedValue({ _id: 'd1', displayOrder: 0 });

      await dishService.createDish('Tea', 30, cafeId, 'cat-1', userId, role);

      expect(mockDish.create).toHaveBeenCalledWith(
        expect.objectContaining({ displayOrder: 0 })
      );
    });

    it('should throw if category does not belong to the cafe', async () => {
      mockCategory.findOne.mockResolvedValue(null);
      await expect(
        dishService.createDish('X', 10, cafeId, 'cat-1', userId, role)
      ).rejects.toThrow('Category not found in this cafe');
    });
  });

  describe('reorderDishes', () => {
    it('should update category and displayOrder for each item', async () => {
      const items = [
        { id: 'd1', category: 'cat-2', displayOrder: 0 },
        { id: 'd2', category: 'cat-2', displayOrder: 1 },
      ];
      mockDish.find
        .mockResolvedValueOnce([{ _id: 'd1' }, { _id: 'd2' }])
        .mockReturnValueOnce(dishFindChain([]));
      mockCategory.find.mockResolvedValue([{ _id: 'cat-2' }]);
      mockDish.updateOne.mockResolvedValue({});
      mockDish.countDocuments.mockResolvedValue(2);

      await dishService.reorderDishes(cafeId, items, userId, role);

      expect(mockDish.updateOne).toHaveBeenCalledTimes(2);
      expect(mockDish.updateOne).toHaveBeenCalledWith(
        { _id: 'd1', cafe: cafeId },
        { $set: { category: 'cat-2', displayOrder: 0 } }
      );
    });

    it('should throw if a dish does not belong to the cafe', async () => {
      mockDish.find.mockResolvedValue([{ _id: 'd1' }]);
      await expect(
        dishService.reorderDishes(cafeId, [
          { id: 'd1', category: 'cat-2', displayOrder: 0 },
          { id: 'missing', category: 'cat-2', displayOrder: 1 },
        ], userId, role)
      ).rejects.toThrow('One or more dishes not found in this cafe');
    });

    it('should throw if a category does not belong to the cafe', async () => {
      mockDish.find.mockResolvedValue([{ _id: 'd1' }, { _id: 'd2' }]);
      mockCategory.find.mockResolvedValue([{ _id: 'cat-2' }]);
      await expect(
        dishService.reorderDishes(cafeId, [
          { id: 'd1', category: 'cat-2', displayOrder: 0 },
          { id: 'd2', category: 'missing-cat', displayOrder: 1 },
        ], userId, role)
      ).rejects.toThrow('One or more categories not found in this cafe');
    });
  });
});
