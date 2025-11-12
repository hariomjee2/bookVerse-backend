"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteReview = exports.addReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Vote_1 = __importDefault(require("../models/Vote"));
const Book_1 = __importDefault(require("../models/Book"));
const logger_1 = __importDefault(require("../utils/logger"));
const addReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;
        const userId = (req.user?.id ?? req.user?.id);
        logger_1.default.info(`User ${String(userId)} adding review for book ${bookId} with rating ${rating}`);
        const bookExists = await Book_1.default.findById(bookId);
        if (!bookExists) {
            logger_1.default.warn(`Review failed: Book not found - ${bookId}`);
            return res.status(404).json({ message: 'Book not found.' });
        }
        const existingReview = await Review_1.default.findOne({ bookId, userId });
        if (existingReview) {
            logger_1.default.warn(`Review failed: User ${String(userId)} already reviewed book ${bookId}`);
            return res.status(409).json({ message: 'You have already reviewed this book.' });
        }
        const review = new Review_1.default({ bookId, userId, rating, comment });
        await review.save();
        logger_1.default.info(`Review added successfully: ${review._id} for book ${bookId}`);
        return res.status(201).json({ message: 'Review added.', review });
    }
    catch (err) {
        logger_1.default.error(`Failed to add review: ${err?.message || err}`);
        return res.status(500).json({ message: 'Failed to add review.', error: err?.message || String(err) });
    }
};
exports.addReview = addReview;
const voteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = (req.user?.id ?? req.user?.id);
        const { vote } = req.body;
        logger_1.default.info(`User ${String(userId)} voting ${vote} on review ${reviewId}`);
        const reviewExists = await Review_1.default.findById(reviewId);
        if (!reviewExists) {
            logger_1.default.warn(`Vote failed: Review not found - ${reviewId}`);
            return res.status(404).json({ message: 'Review not found.' });
        }
        const existingVote = await Vote_1.default.findOne({ reviewId, userId });
        if (existingVote) {
            logger_1.default.warn(`Vote failed: User ${String(userId)} already voted on review ${reviewId}`);
            return res.status(409).json({ message: 'You have already voted on this review.' });
        }
        const newVote = new Vote_1.default({ reviewId, userId, vote });
        await newVote.save();
        logger_1.default.info(`Vote recorded successfully: ${newVote._id} (${vote}) on review ${reviewId}`);
        return res.status(200).json({ message: 'Vote recorded.' });
    }
    catch (err) {
        logger_1.default.error(`Failed to vote: ${err?.message || err}`);
        return res.status(500).json({ message: 'Failed to vote.', error: err?.message || String(err) });
    }
};
exports.voteReview = voteReview;
exports.default = { addReview: exports.addReview, voteReview: exports.voteReview };
