import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';
import logger from '../utils/logger';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email, password } = req.body as { username: string; email: string; password: string };
    logger.info(`Signup attempt for username: ${username}, email: ${email}`);

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      logger.warn(`Signup failed: Username or email already exists - ${username}`);
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash } as Partial<IUser>);
    await user.save();
    logger.info(`User successfully created: ${username}`);

    const token = generateToken(user);
    return res.status(201).json({ token });
  } catch (err: any) {
    logger.error(`Signup error: ${err?.message || err}`);
    return res.status(500).json({ message: 'Signup failed.', error: err?.message || String(err) });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User not found - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for user - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    logger.info(`User successfully logged in: ${email}`);
    const token = generateToken(user);
    return res.json({ token });
  } catch (err: any) {
    logger.error(`Login error: ${err?.message || err}`);
    return res.status(500).json({ message: 'Login failed.', error: err?.message || String(err) });
  }
};

export default { signup, login };
