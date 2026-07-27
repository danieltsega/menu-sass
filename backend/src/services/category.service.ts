import Category from '../models/Category';
import Cafe from '../models/Cafe';
import { Role } from '../types/enums';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

const verifyCafeAccess = async (cafeId: string, userId: string, role: Role) => {
  if (role === Role.SUPER_ADMIN) return;
  const cafe = await Cafe.findById(cafeId);
  if (!cafe || cafe.admin !== userId) {
    throw new Error('Not authorized to manage this cafe');
  }
};

export const createCategory = async (
  name: string,
  cafe: string,
  userId: string,
  role: Role,
  extra?: { description?: string; displayOrder?: number }
) => {
  await verifyCafeAccess(cafe, userId, role);
  const category = await Category.create({ name, cafe, ...extra });
  return category;
};

export const getCategoriesByCafe = async (cafeId: string, userId: string, role: Role, page?: number, limit?: number) => {
  await verifyCafeAccess(cafeId, userId, role);
  const pagination = getPaginationParams(page, limit);
  const [categories, total] = await Promise.all([
    Category.find({ cafe: cafeId }).sort({ displayOrder: 1 }).skip(pagination.skip).limit(pagination.limit),
    Category.countDocuments({ cafe: cafeId }),
  ]);
  return { categories, pagination: getPaginationMeta(total, pagination) };
};

export const getCategoryById = async (cafeId: string, categoryId: string, userId: string, role: Role) => {
  await verifyCafeAccess(cafeId, userId, role);
  const category = await Category.findOne({ _id: categoryId, cafe: cafeId });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const updateCategory = async (
  cafeId: string,
  categoryId: string,
  data: Partial<{ name: string; description: string; displayOrder: number; isActive: boolean }>,
  userId: string,
  role: Role
) => {
  await verifyCafeAccess(cafeId, userId, role);
  const category = await Category.findOneAndUpdate(
    { _id: categoryId, cafe: cafeId },
    data,
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const deleteCategory = async (cafeId: string, categoryId: string, userId: string, role: Role) => {
  await verifyCafeAccess(cafeId, userId, role);
  const category = await Category.findOneAndDelete({ _id: categoryId, cafe: cafeId });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};