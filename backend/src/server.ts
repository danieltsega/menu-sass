import app from './app';
import config from './config';
import connectDB from './config/database';

const start = async () => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  connectDB();
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
});