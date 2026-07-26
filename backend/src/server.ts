import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config';
import connectDB from './config/database';

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start();