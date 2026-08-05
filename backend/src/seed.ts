import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Cafe, Category, Dish } from './models';
import config from './config';
import { Role } from './types/enums';

const seed = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const superEmail = process.env.SEED_ADMIN_EMAIL || 'admin@menusass.com';
    const superPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';
    const cafeEmail = process.env.SEED_CAFE_EMAIL || 'cafe@brewbean.com';

    const superName = process.env.SEED_ADMIN_NAME || 'Super Admin';
    const cafeName = process.env.SEED_CAFE_NAME || 'Cafe Owner';

    let superAdmin = await User.findOne({ email: superEmail });
    if (!superAdmin) {
      superAdmin = await User.create({ name: superName, email: superEmail, password: superPassword, role: Role.SUPER_ADMIN });
      console.log(`Super admin created (${superEmail} / ${superPassword})`);
    } else {
      console.log('Super admin already exists');
    }

    let cafeAdmin = await User.findOne({ email: cafeEmail });
    if (!cafeAdmin) {
      cafeAdmin = await User.create({ name: cafeName, email: cafeEmail, password: superPassword, role: Role.CAFE_ADMIN });
      console.log(`Cafe admin created (${cafeEmail} / ${superPassword})`);
    } else {
      console.log('Cafe admin already exists');
    }

    const slug = process.env.SEED_CAFE_SLUG || 'brew-and-bean';
    let cafe = await Cafe.findOne({ slug });
    if (!cafe) {
      cafe = await Cafe.create({
        name: 'Brew & Bean',
        slug,
        description: 'Artisan coffee & homemade pastries in the heart of the city.',
        address: 'Bole Road, Addis Ababa',
        phone: '+251 911 234 567',
        admin: cafeAdmin._id,
      });
      console.log(`Cafe created (${cafe.name})`);

      const seedCategories = [
        { name: 'Coffee', description: 'Handcrafted espresso drinks', displayOrder: 1, dishes: [
          { name: 'Classic Espresso', price: 3.5, description: 'Rich single-origin espresso shot', ingredients: ['Arabica beans', 'Filtered water'] },
          { name: 'Cappuccino', price: 4.5, description: 'Espresso with steamed milk', ingredients: ['Espresso', 'Whole milk', 'Cinnamon'] },
          { name: 'Iced Latte', price: 5.0, ingredients: ['Espresso', 'Cold milk', 'Ice'] },
        ] },
        { name: 'Pastries', description: 'Freshly baked daily', displayOrder: 2, dishes: [
          { name: 'Croissant', price: 3.0, ingredients: ['Puff pastry', 'Butter', 'Egg wash'] },
          { name: 'Blueberry Muffin', price: 3.5, ingredients: ['Flour', 'Blueberries', 'Sugar', 'Butter'] },
        ] },
        { name: 'Breakfast', description: 'Served all day', displayOrder: 3, dishes: [
          { name: 'Avocado Toast', price: 8.0, ingredients: ['Sourdough bread', 'Avocado', 'Cherry tomatoes'] },
        ] },
        { name: 'Cold Drinks', displayOrder: 4, dishes: [
          { name: 'Matcha Latte', price: 5.5, ingredients: ['Matcha powder', 'Oat milk', 'Vanilla syrup'] },
          { name: 'Fresh Lemonade', price: 4.0, ingredients: ['Fresh lemon juice', 'Sugar', 'Mint'] },
        ] },
      ];

      for (const catSeed of seedCategories) {
        const category = await Category.create({
          name: catSeed.name,
          description: catSeed.description,
          cafe: cafe._id,
          displayOrder: catSeed.displayOrder,
        });
        for (const dishSeed of catSeed.dishes) {
          await Dish.create({
            name: dishSeed.name,
            price: dishSeed.price,
            ingredients: dishSeed.ingredients,
            category: category._id,
            cafe: cafe._id,
          });
        }
      }
      console.log('Sample categories & dishes created');
    } else {
      console.log('Cafe already exists');
    }

    await mongoose.disconnect();
    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();