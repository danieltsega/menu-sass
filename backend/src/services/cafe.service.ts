import Cafe from '../models/Cafe';

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

export const getAllCafes = async () => {
  const cafes = await Cafe.find().sort({ createdAt: -1 });
  return cafes;
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