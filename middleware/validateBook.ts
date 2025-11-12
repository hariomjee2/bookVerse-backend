import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export default function validateBook(req: Request, res: Response, next: NextFunction) {
  const { title, author, genre, year, summary } = req.body as any;
  const errors: string[] = [];

  if (!title || title.length < 3) errors.push('Title must be at least 3 characters.');
  if (!author) errors.push('Author is required.');
  if (!['Programming', 'Fiction', 'Science', 'History'].includes(genre)) {
    errors.push('Genre must be one of Programming, Fiction, Science, History.');
  }
  const currentYear = new Date().getFullYear();
  if (!year || year < 1800 || year > currentYear) {
    errors.push(`Year must be between 1800 and ${currentYear}.`);
  }
  if (summary && summary.length > 500) {
    errors.push('Summary must be less than 500 characters.');
  }

  if (errors.length > 0) {
    logger.warn(`Book validation failed for ${title}: ${errors.join(', ')}`);
    return res.status(400).json({ errors });
  }

  logger.info(`Book validation passed for: ${title} by ${author}`);
  next();
}
