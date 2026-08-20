import { Router } from 'express';
import {
  getSectionsByMuseum,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} from '../controllers/sectionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/museum/:museumId', getSectionsByMuseum);
router.get('/:id', getSectionById);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN', 'EDITOR'), createSection);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN', 'EDITOR'), updateSection);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN'), deleteSection);

export default router;
