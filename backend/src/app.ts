import express from 'express';
import morgan from 'morgan';
import { authRoutes } from './routes';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

export default app;