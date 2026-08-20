import { Router } from 'express';
import {
  getArtifacts,
  getArtifactById,
  createArtifact,
  updateArtifact,
  updateArtifactStatus,
  deleteArtifact,
} from '../controllers/artifactController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getArtifacts);
router.get('/:id', getArtifactById);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN', 'EDITOR'), createArtifact);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN', 'EDITOR'), updateArtifact);
router.patch('/:id/status', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN', 'EDITOR'), updateArtifactStatus);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'MUSEUM_ADMIN'), deleteArtifact);

export default router;
