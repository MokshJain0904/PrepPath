import { Router } from 'express';
import { getHeatmap, getSummary } from '../controllers/statsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/heatmap', getHeatmap);
router.get('/summary', getSummary);

export default router;
