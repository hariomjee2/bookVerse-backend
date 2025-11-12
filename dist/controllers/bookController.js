"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookDetails = exports.getBooks = exports.createBook = void 0;
const Book_1 = __importDefault(require("../models/Book"));
const Review_1 = __importDefault(require("../models/Review"));
const logger_1 = __importDefault(require("../utils/logger"));
const createBook = async (req, res) => {
    try {
        const { title, author, genre, year, summary } = req.body;
        const userId = req.user?.id;
        logger_1.default.info(`Creating book: ${title} by ${author} (User: ${String(userId)})`);
        const book = new Book_1.default({ title, author, genre, year, summary, createdBy: userId });
        await book.save();
        logger_1.default.info(`Book created successfully: ${book._id} - ${title}`);
        return res.status(201).json({ message: 'Book created successfully.', book });
    }
    catch (err) {
        logger_1.default.error(`Failed to create book: ${err?.message || err}`);
        return res.status(500).json({ message: 'Failed to create book.', error: err?.message || String(err) });
    }
};
exports.createBook = createBook;
const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const genre = req.query.genre;
        const sort = req.query.sort;
        logger_1.default.info(`Fetching books - Page: ${page}, Limit: ${limit}, Genre: ${genre || 'all'}, Sort: ${sort || 'none'}`);
        const filter = genre ? { genre } : {};
        const books = await Book_1.default.find(filter).skip((page - 1) * limit).limit(limit);
        const bookIds = books.map(b => b._id);
        const stats = await Review_1.default.aggregate([
            { $match: { bookId: { $in: bookIds } } },
            { $group: { _id: '$bookId', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
        ]);
        const statsMap = {};
        stats.forEach((s) => {
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
        logger_1.default.info(`Successfully fetched ${books.length} books`);
        return res.json({ page, limit, books: result });
    }
    catch (err) {
        logger_1.default.error(`Failed to fetch books: ${err?.message || err}`);
        return res.status(500).json({ message: 'Failed to fetch books.', error: err?.message || String(err) });
    }
};
exports.getBooks = getBooks;
const getBookDetails = async (req, res) => {
    try {
        const bookId = req.params.id;
        logger_1.default.info(`Fetching book details for bookId: ${bookId}`);
        const book = await Book_1.default.findById(bookId);
        if (!book) {
            logger_1.default.warn(`Book not found: ${bookId}`);
            return res.status(404).json({ message: 'Book not found.' });
        }
        const reviews = await Review_1.default.find({ bookId }).populate('userId', 'username');
        const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : '0.00';
        const totalReviews = reviews.length;
        logger_1.default.info(`Book details fetched: ${book.title} (${totalReviews} reviews, rating: ${averageRating})`);
        return res.json({
            book,
            reviews: reviews.map(r => ({ rating: r.rating, comment: r.comment, reviewer: r.userId.username })),
            stats: { averageRating, totalReviews }
        });
    }
    catch (err) {
        logger_1.default.error(`Failed to fetch book details: ${err?.message || err}`);
        return res.status(500).json({ message: 'Failed to fetch book details.', error: err?.message || String(err) });
    }
};
exports.getBookDetails = getBookDetails;
exports.default = { createBook: exports.createBook, getBooks: exports.getBooks, getBookDetails: exports.getBookDetails };
