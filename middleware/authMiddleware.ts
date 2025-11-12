import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Auth failed: Missing or invalid token from ${req.ip}`);
    return res.status(401).json({ message: 'Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    logger.info(`Authentication successful for user: ${decoded.username}`);
    req.user = decoded;
    next();
  } catch (err: any) {
    logger.error(`Token verification failed: ${err?.message || err} from ${req.ip}`);
    return res.status(401).json({ message: 'Unauthorized.' });
  }
}
