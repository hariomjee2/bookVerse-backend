"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateBook;
const logger_1 = __importDefault(require("../utils/logger"));
function validateBook(req, res, next) {
    const { title, author, genre, year, summary } = req.body;
    const errors = [];
    if (!title || title.length < 3)
        errors.push('Title must be at least 3 characters.');
    if (!author)
        errors.push('Author is required.');
    if (!['Programming', 'Fiction', 'Science', 'History'].includes(genre)) {
        errors.push('Genre must be one of Programming, Fiction, Science, History.');
    }
    const currentYear = new Date().getFullYear();
    if (!year || year < 1800 || year > currentYear) {
        errors.push(`Year must be between 1800 and ${currentYear}.`);
    }
    if (summary && summary.length > 500) {
        errors.push('Summary must be less than 500 characters.');
    }
    if (errors.length > 0) {
        logger_1.default.warn(`Book validation failed for ${title}: ${errors.join(', ')}`);
        return res.status(400).json({ errors });
    }
    logger_1.default.info(`Book validation passed for: ${title} by ${author}`);
    next();
}
