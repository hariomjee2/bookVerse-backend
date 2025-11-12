import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export default function validateVote(req: Request, res: Response, next: NextFunction) {
  const { vote } = req.body as any;
  if (!['up', 'down'].includes(vote)) {
    logger.warn(`Vote validation failed: Invalid vote type - ${vote}`);
    return res.status(400).json({ message: 'Vote must be "up" or "down".' });
  }
  logger.info(`Vote validation passed: ${vote}`);
  next();
}
