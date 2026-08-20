import { Router } from 'express';
import { uploadMedia, getMediaList, deleteMedia } from '../controllers/mediaController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, getMediaList);
router.post('/upload', authenticate, upload.single('file'), uploadMedia);
router.delete('/:id', authenticate, deleteMedia);

export default router;
