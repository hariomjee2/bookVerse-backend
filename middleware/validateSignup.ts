import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export default function validateSignup(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body as any;
  const errors: string[] = [];

  if (!username || username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username)) {
    errors.push('Username must be at least 3 characters and alphanumeric only.');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Email must be valid.');
  }

  if (
    !password ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    errors.push('Password must be at least 8 characters and include uppercase, number, and symbol.');
  }

  if (errors.length > 0) {
    logger.warn(`Signup validation failed for ${email}: ${errors.join(', ')}`);
    return res.status(400).json({ errors });
  }

  logger.info(`Signup validation passed for email: ${email}`);
  next();
}
