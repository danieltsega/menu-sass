const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/menu-sass',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_dev_refresh_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

export default config;