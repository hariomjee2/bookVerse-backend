import express from 'express';
import * as bookController from '../controllers/bookController';
import authMiddleware from '../middleware/authMiddleware';
import validateBook from '../middleware/validateBook';
import logger from '../utils/logger';

const router = express.Router();

router.post('/', authMiddleware, validateBook, bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookDetails);

logger.info('Book routes initialized');

export default router;
