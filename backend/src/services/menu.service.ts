import Cafe from '../models/Cafe';
import Category from '../models/Category';
import Dish from '../models/Dish';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

export const getPublicMenu = async (cafeSlug: string, dishLimit = 6) => {
  const cafe = await Cafe.findOne({ slug: cafeSlug, isActive: true });
  if (!cafe) {
    throw new Error('Cafe not found');
  }

  const categories = await Category.find({ cafe: cafe._id, isActive: true })
    .sort({ displayOrder: 1 });

  const categoryIds = categories.map((c) => c._id);

  const dishGroups = await Dish.aggregate<{ _id: string; dishes: unknown[]; dishCount: number }>([
    { $match: { cafe: cafe._id, category: { $in: categoryIds }, isAvailable: true } },
    { $sort: { displayOrder: 1, createdAt: -1 } },
    { $group: { _id: '$category', dishes: { $push: '$$ROOT' } } },
    {
      $project: {
        _id: 1,
        dishes: { $slice: ['$dishes', dishLimit] },
        dishCount: { $size: '$dishes' },
      },
    },
  ]);

  const dishesByCategory = new Map<string, unknown[]>(dishGroups.map((g) => [String(g._id), g.dishes]));
  const dishCounts = new Map<string, number>(dishGroups.map((g) => [String(g._id), g.dishCount]));

  const categoriesWithDishes = categories.map((cat) => ({
    ...cat.toJSON(),
    dishes: dishesByCategory.get(String(cat._id)) || [],
    dishCount: dishCounts.get(String(cat._id)) || 0,
  }));

  return {
    cafe,
    categories: categoriesWithDishes,
  };
};

export const getCategoryDishes = async (cafeSlug: string, categoryId: string, page?: number, limit?: number) => {
  const cafe = await Cafe.findOne({ slug: cafeSlug, isActive: true });
  if (!cafe) {
    throw new Error('Cafe not found');
  }

  const category = await Category.findOne({ _id: categoryId, cafe: cafe._id, isActive: true });
  if (!category) {
    throw new Error('Category not found');
  }

  const pagination = getPaginationParams(page, limit);
  const [dishes, total] = await Promise.all([
    Dish.find({ cafe: cafe._id, category: category._id, isAvailable: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Dish.countDocuments({ cafe: cafe._id, category: category._id, isAvailable: true }),
  ]);

  return { dishes, pagination: getPaginationMeta(total, pagination) };
};