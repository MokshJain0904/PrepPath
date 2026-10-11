import { Router } from 'express';
import { getWeeklyReview } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/weekly', getWeeklyReview);

export default router;
