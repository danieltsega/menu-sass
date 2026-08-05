import Cafe from '../models/Cafe';
import { getPaginationParams, getPaginationMeta, PaginationMeta } from '../utils/pagination';

export const createCafe = async (
  name: string,
  slug: string,
  admin: string,
  extra?: { description?: string; address?: string; phone?: string }
) => {
  const existing = await Cafe.findOne({ slug });
  if (existing) {
    throw new Error('Cafe slug already exists');
  }

  const cafe = await Cafe.create({ name, slug, admin, ...extra });
  return cafe;
};

export const getAllCafes = async (page?: number, limit?: number) => {
  const pagination = getPaginationParams(page, limit);
  const [cafes, total] = await Promise.all([
    Cafe.find().sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    Cafe.countDocuments(),
  ]);
  return { cafes, pagination: getPaginationMeta(total, pagination) };
};

export const getCafeById = async (id: string) => {
  const cafe = await Cafe.findById(id);
  if (!cafe) {
    throw new Error('Cafe not found');
  }
  return cafe;
};

export const updateCafe = async (
  id: string,
  data: Partial<{ name: string; slug: string; description: string; address: string; phone: string; isActive: boolean }>
) => {
  if (data.slug) {
    const existing = await Cafe.findOne({ slug: data.slug, _id: { $ne: id } });
    if (existing) {
      throw new Error('Cafe slug already exists');
    }
  }

  const cafe = await Cafe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!cafe) {
    throw new Error('Cafe not found');
  }
  return cafe;
};

export const deleteCafe = async (id: string) => {
  const cafe = await Cafe.findByIdAndDelete(id);
  if (!cafe) {
    throw new Error('Cafe not found');
  }
  return cafe;
};

export const getCafeByAdmin = async (adminId: string) => {
  const cafe = await Cafe.findOne({ admin: adminId });
  if (!cafe) {
    throw new Error('Cafe not found');
  }
  return cafe;
};

export const updateCafeByAdmin = async (
  adminId: string,
  data: Partial<{ name: string; slug: string; description: string; address: string; phone: string }>
) => {
  const cafe = await Cafe.findOne({ admin: adminId });
  if (!cafe) {
    throw new Error('Cafe not found');
  }

  if (data.slug) {
    const existing = await Cafe.findOne({ slug: data.slug, _id: { $ne: cafe._id } });
    if (existing) {
      throw new Error('Cafe slug already exists');
    }
  }

  return Cafe.findByIdAndUpdate(cafe._id, data, { new: true, runValidators: true });
};