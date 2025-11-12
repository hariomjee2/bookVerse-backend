"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateReview;
const logger_1 = __importDefault(require("../utils/logger"));
function validateReview(req, res, next) {
    const { bookId, rating, comment } = req.body;
    const errors = [];
    if (!bookId)
        errors.push('bookId is required.');
    if (!rating || rating < 1 || rating > 5)
        errors.push('Rating must be between 1 and 5.');
    if (comment && comment.length > 500)
        errors.push('Comment must be under 500 characters.');
    if (errors.length > 0) {
        logger_1.default.warn(`Review validation failed for bookId ${bookId}: ${errors.join(', ')}`);
        return res.status(400).json({ errors });
    }
    logger_1.default.info(`Review validation passed for bookId: ${bookId} with rating: ${rating}`);
    next();
}
