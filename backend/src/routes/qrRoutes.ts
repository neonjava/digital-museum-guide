import { Router } from 'express';
import {
  getAllQRCodes,
  getQRCodeByArtifactId,
  downloadQRPNG,
  downloadQRSVG,
  regenerateQRCode,
} from '../controllers/qrController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public download routes
router.get('/download/png/:shortCode', downloadQRPNG);
router.get('/download/svg/:shortCode', downloadQRSVG);

// Admin / query routes
router.get('/', authenticate, getAllQRCodes);
router.get('/artifact/:artifactId', getQRCodeByArtifactId);
router.post('/regenerate/:artifactId', authenticate, regenerateQRCode);

export default router;
