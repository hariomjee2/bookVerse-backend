import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export default function validateReview(req: Request, res: Response, next: NextFunction) {
  const { bookId, rating, comment } = req.body as any;
  const errors: string[] = [];

  if (!bookId) errors.push('bookId is required.');
  if (!rating || rating < 1 || rating > 5) errors.push('Rating must be between 1 and 5.');
  if (comment && comment.length > 500) errors.push('Comment must be under 500 characters.');

  if (errors.length > 0) {
    logger.warn(`Review validation failed for bookId ${bookId}: ${errors.join(', ')}`);
    return res.status(400).json({ errors });
  }

  logger.info(`Review validation passed for bookId: ${bookId} with rating: ${rating}`);
  next();
}
