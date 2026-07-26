import express from 'express';
import morgan from 'morgan';
import { authRoutes, cafeRoutes, categoryRoutes, dishRoutes, menuRoutes } from './routes';
import { errorHandler, notFound } from './middleware';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/cafes/:cafeId/categories', categoryRoutes);
app.use('/api/cafes/:cafeId/dishes', dishRoutes);
app.use('/api/menu', menuRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;