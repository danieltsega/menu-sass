import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from './models';
import config from './config';
import { Role } from './types/enums';

const seed = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const name = process.env.SEED_ADMIN_NAME || 'Super Admin';
    const email = process.env.SEED_ADMIN_EMAIL || 'super@cafe.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123456';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Super admin already exists (${email})`);
    } else {
      await User.create({ name, email, password, role: Role.SUPER_ADMIN });
      console.log(`Super admin created (${email} / ${password})`);
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