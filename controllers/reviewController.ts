import { Request, Response } from 'express';
import Review from '../models/Review';
import Vote from '../models/Vote';
import Book from '../models/Book';
import logger from '../utils/logger';
import { Types } from 'mongoose';

export const addReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { bookId, rating, comment } = req.body as { bookId: any; rating: number; comment?: string };
    const userId = (req.user?.id ?? (req as any).user?.id) as Types.ObjectId;
    logger.info(`User ${String(userId)} adding review for book ${bookId} with rating ${rating}`);

    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      logger.warn(`Review failed: Book not found - ${bookId}`);
      return res.status(404).json({ message: 'Book not found.' });
    }

    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
      logger.warn(`Review failed: User ${String(userId)} already reviewed book ${bookId}`);
      return res.status(409).json({ message: 'You have already reviewed this book.' });
    }

    const review = new Review({ bookId, userId, rating, comment });
    await review.save();
    logger.info(`Review added successfully: ${review._id} for book ${bookId}`);

    return res.status(201).json({ message: 'Review added.', review });
  } catch (err: any) {
    logger.error(`Failed to add review: ${err?.message || err}`);
    return res.status(500).json({ message: 'Failed to add review.', error: err?.message || String(err) });
  }
};

export const voteReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reviewId = req.params.id;
    const userId = (req.user?.id ?? (req as any).user?.id) as Types.ObjectId;
    const { vote } = req.body as { vote: 'up' | 'down' };
    logger.info(`User ${String(userId)} voting ${vote} on review ${reviewId}`);

    const reviewExists = await Review.findById(reviewId);
    if (!reviewExists) {
      logger.warn(`Vote failed: Review not found - ${reviewId}`);
      return res.status(404).json({ message: 'Review not found.' });
    }

    const existingVote = await Vote.findOne({ reviewId, userId });
    if (existingVote) {
      logger.warn(`Vote failed: User ${String(userId)} already voted on review ${reviewId}`);
      return res.status(409).json({ message: 'You have already voted on this review.' });
    }

    const newVote = new Vote({ reviewId, userId, vote });
    await newVote.save();
    logger.info(`Vote recorded successfully: ${newVote._id} (${vote}) on review ${reviewId}`);

    return res.status(200).json({ message: 'Vote recorded.' });
  } catch (err: any) {
    logger.error(`Failed to vote: ${err?.message || err}`);
    return res.status(500).json({ message: 'Failed to vote.', error: err?.message || String(err) });
  }
};

export default { addReview, voteReview };
