import { Router } from 'express';
import {
  getMuseums,
  getMuseumById,
  createMuseum,
  updateMuseum,
  deleteMuseum,
} from '../controllers/museumController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getMuseums);
router.get('/:id', getMuseumById);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN'), createMuseum);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN'), updateMuseum);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), deleteMuseum);

export default router;
