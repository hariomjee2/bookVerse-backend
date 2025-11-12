import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';
import Review, { IReview } from '../models/Review';
import logger from '../utils/logger';
import { Types } from 'mongoose';

export const createBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, author, genre, year, summary } = req.body as Partial<IBook>;
    const userId = (req as any).user?.id as Types.ObjectId;
    logger.info(`Creating book: ${title} by ${author} (User: ${String(userId)})`);

    const book = new Book({ title, author, genre, year, summary, createdBy: userId } as Partial<IBook>);
    await book.save();
    logger.info(`Book created successfully: ${book._id} - ${title}`);
    return res.status(201).json({ message: 'Book created successfully.', book });
  } catch (err: any) {
    logger.error(`Failed to create book: ${err?.message || err}`);
    return res.status(500).json({ message: 'Failed to create book.', error: err?.message || String(err) });
  }
};

export const getBooks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const genre = req.query.genre as string | undefined;
    const sort = req.query.sort as string | undefined;

    logger.info(`Fetching books - Page: ${page}, Limit: ${limit}, Genre: ${genre || 'all'}, Sort: ${sort || 'none'}`);
    const filter = genre ? { genre } : {};

    const books = await Book.find(filter).skip((page - 1) * limit).limit(limit);
    const bookIds = books.map(b => b._id);

    const stats = await Review.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: '$bookId', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const statsMap: Record<string, { averageRating: string; totalReviews: number }> = {};
    stats.forEach((s: any) => {
      statsMap[String(s._id)] = { averageRating: Number(s.averageRating).toFixed(2), totalReviews: s.totalReviews };
    });

    const result = books.map(b => ({
      ...b.toObject(),
      averageRating: statsMap[String(b._id)]?.averageRating || '0.00',
      totalReviews: statsMap[String(b._id)]?.totalReviews || 0
    }));

    if (sort === 'rating_desc') {
      result.sort((a, b) => Number(b.averageRating) - Number(a.averageRating));
    }

    logger.info(`Successfully fetched ${books.length} books`);
    return res.json({ page, limit, books: result });
  } catch (err: any) {
    logger.error(`Failed to fetch books: ${err?.message || err}`);
    return res.status(500).json({ message: 'Failed to fetch books.', error: err?.message || String(err) });
  }
};

export const getBookDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bookId = req.params.id;
    logger.info(`Fetching book details for bookId: ${bookId}`);

    const book = await Book.findById(bookId);
    if (!book) {
      logger.warn(`Book not found: ${bookId}`);
      return res.status(404).json({ message: 'Book not found.' });
    }

    const reviews = await Review.find({ bookId }).populate('userId', 'username');

    const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : '0.00';
    const totalReviews = reviews.length;

    logger.info(`Book details fetched: ${book.title} (${totalReviews} reviews, rating: ${averageRating})`);
    return res.json({
      book,
      reviews: reviews.map(r => ({ rating: r.rating, comment: r.comment, reviewer: (r.userId as any).username })),
      stats: { averageRating, totalReviews }
    });
  } catch (err: any) {
    logger.error(`Failed to fetch book details: ${err?.message || err}`);
    return res.status(500).json({ message: 'Failed to fetch book details.', error: err?.message || String(err) });
  }
};

export default { createBook, getBooks, getBookDetails };
