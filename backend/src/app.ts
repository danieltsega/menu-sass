import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import morgan from 'morgan';
import { authRoutes, cafeRoutes, categoryRoutes, dishRoutes, menuRoutes, uploadRoutes, userRoutes } from './routes';
import { errorHandler, notFound, sanitize } from './middleware';
import config from './config';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later' },
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(sanitize);
app.use(hpp());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/cafes/:cafeId/categories', categoryRoutes);
app.use('/api/cafes/:cafeId/dishes', dishRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;