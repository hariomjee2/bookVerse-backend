import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimiter from './middleware/rateLimiter';
import logger from './utils/logger';

import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import reviewRoutes from './routes/reviewRoutes';

dotenv.config();

const app = express() as express.Application;
app.use(rateLimiter as any);

app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (_req: Request, res: Response) => {
  logger.info('Root endpoint accessed');
  res.send('BookVerse API is running');
});

const mongoUri = process.env.MONGO_URI as string;

mongoose
  .connect(mongoUri)
  .then(() => {
    logger.info('Connected to MongoDB');
    const port = process.env.PORT || '5000';
    app.listen(Number(port), () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

export default app;
