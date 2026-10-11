import { Router } from 'express';
import { generatePlan, getActivePlan, updatePlan, reschedulePlan, getCareerGuidance } from '../controllers/planController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/career-guidance', getCareerGuidance);
router.post('/generate', generatePlan);
router.get('/active', getActivePlan);
router.patch('/:id', updatePlan);
router.post('/:id/reschedule', reschedulePlan);

export default router;
