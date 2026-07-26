import Cafe from '../models/Cafe';
import Category from '../models/Category';
import Dish from '../models/Dish';

export const getPublicMenu = async (cafeSlug: string) => {
  const cafe = await Cafe.findOne({ slug: cafeSlug, isActive: true });
  if (!cafe) {
    throw new Error('Cafe not found');
  }

  const categories = await Category.find({ cafe: cafe._id, isActive: true })
    .sort({ displayOrder: 1 });

  const categoryIds = categories.map((c) => c._id);

  const dishes = await Dish.find({
    cafe: cafe._id,
    category: { $in: categoryIds },
    isAvailable: true,
  }).sort({ createdAt: -1 });

  const dishesByCategory = dishes.reduce<Record<string, typeof dishes>>((acc, dish) => {
    if (!acc[dish.category]) acc[dish.category] = [];
    acc[dish.category].push(dish);
    return acc;
  }, {});

  const categoriesWithDishes = categories.map((cat) => ({
    ...cat.toJSON(),
    dishes: dishesByCategory[cat._id] || [],
  }));

  return {
    cafe,
    categories: categoriesWithDishes,
  };
};