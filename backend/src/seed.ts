import mongoose from 'mongoose';
import { User } from './models';
import config from './config';
import { Role } from './types/enums';

const seed = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const superEmail = process.env.SEED_ADMIN_EMAIL || 'danieltsega6658@gmail.com';
    const superPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';
    const superName = process.env.SEED_ADMIN_NAME || 'Super Admin';

    const superAdmin = await User.findOne({ email: superEmail });
    if (!superAdmin) {
      await User.create({ name: superName, email: superEmail, password: superPassword, role: Role.SUPER_ADMIN });
      console.log(`Super admin created (${superEmail})`);
    } else {
      console.log('Super admin already exists');
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
