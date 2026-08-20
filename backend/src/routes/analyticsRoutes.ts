import { Router } from 'express';
import { trackEvent, getMuseumAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public telemetry tracking (views, scans, audio/video plays)
router.post('/view', trackEvent);
router.post('/track', trackEvent);

// Admin analytics dashboard
router.get('/museum/:museumId', authenticate, getMuseumAnalytics);

export default router;
