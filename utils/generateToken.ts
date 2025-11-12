import jwt from 'jsonwebtoken';
import logger from './logger';
import { Document } from 'mongoose';

interface IUserDoc extends Document {
  _id: any;
  username: string;
}

export default function generateToken(user: IUserDoc): string {
  try {
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    logger.info(`Token generated successfully for user: ${user.username}`);
    return token;
  } catch (err: any) {
    logger.error(`Failed to generate token for user ${user.username}: ${err?.message || err}`);
    throw err;
  }
}
