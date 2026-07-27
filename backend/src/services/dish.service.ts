import Dish from '../models/Dish';
import Cafe from '../models/Cafe';
import Category from '../models/Category';
import { Role } from '../types/enums';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

const verifyCafeAccess = async (cafeId: string, userId: string, role: Role) => {
  if (role === Role.SUPER_ADMIN) return;
  const cafe = await Cafe.findById(cafeId);
  if (!cafe || cafe.admin !== userId) {
    throw new Error('Not authorized to manage this cafe');
  }
};

export const createDish = async (
  name: string,
  price: number,
  cafe: string,
  category: string,
  userId: string,
  role: Role,
  extra?: { description?: string; ingredients?: string[]; image?: string; isAvailable?: boolean; isFeatured?: boolean }
) => {
  await verifyCafeAccess(cafe, userId, role);

  const categoryExists = await Category.findOne({ _id: category, cafe });
  if (!categoryExists) {
    throw new Error('Category not found in this cafe');
  }

  const dish = await Dish.create({ name, price, cafe, category, ...extra });
  return dish;
};

export const getDishesByCafe = async (cafeId: string, userId: string, role: Role, page?: number, limit?: number) => {
  await verifyCafeAccess(cafeId, userId, role);
  const pagination = getPaginationParams(page, limit);
  const [dishes, total] = await Promise.all([
    Dish.find({ cafe: cafeId }).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    Dish.countDocuments({ cafe: cafeId }),
  ]);
  return { dishes, pagination: getPaginationMeta(total, pagination) };
};

export const getDishById = async (cafeId: string, dishId: string, userId: string, role: Role) => {
  await verifyCafeAccess(cafeId, userId, role);
  const dish = await Dish.findOne({ _id: dishId, cafe: cafeId });
  if (!dish) {
    throw new Error('Dish not found');
  }
  return dish;
};

export const updateDish = async (
  cafeId: string,
  dishId: string,
  data: Partial<{
    name: string; description: string; ingredients: string[];
    price: number; image: string; category: string;
    isAvailable: boolean; isFeatured: boolean;
  }>,
  userId: string,
  role: Role
) => {
  await verifyCafeAccess(cafeId, userId, role);

  if (data.category) {
    const categoryExists = await Category.findOne({ _id: data.category, cafe: cafeId });
    if (!categoryExists) {
      throw new Error('Category not found in this cafe');
    }
  }

  const dish = await Dish.findOneAndUpdate(
    { _id: dishId, cafe: cafeId },
    data,
    { new: true, runValidators: true }
  );
  if (!dish) {
    throw new Error('Dish not found');
  }
  return dish;
};

export const deleteDish = async (cafeId: string, dishId: string, userId: string, role: Role) => {
  await verifyCafeAccess(cafeId, userId, role);
  const dish = await Dish.findOneAndDelete({ _id: dishId, cafe: cafeId });
  if (!dish) {
    throw new Error('Dish not found');
  }
  return dish;
};