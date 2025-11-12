import express from 'express';
import * as authController from '../controllers/authController';
import validateSignup from '../middleware/validateSignup';
import logger from '../utils/logger';

const router = express.Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/login', authController.login);

logger.info('Auth routes initialized');

export default router;
