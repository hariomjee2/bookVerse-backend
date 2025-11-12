import express from 'express';
import * as reviewController from '../controllers/reviewController';
import authMiddleware from '../middleware/authMiddleware';
import validateReview from '../middleware/validateReview';
import validateVote from '../middleware/validateVote';
import logger from '../utils/logger';

const router = express.Router();

router.post('/', authMiddleware, validateReview, reviewController.addReview);
router.patch('/:id/vote', authMiddleware, validateVote, reviewController.voteReview);

logger.info('Review routes initialized');

export default router;
