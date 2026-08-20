import { Router } from 'express';
import {
  getPublicMuseum,
  getPublicSectionArtifacts,
  getPublicArtifact,
  searchPublicArtifacts,
} from '../controllers/publicController';

const router = Router();

router.get('/museum/:identifier', getPublicMuseum);
router.get('/section/:sectionId/artifacts', getPublicSectionArtifacts);
router.get('/artifact/:identifier', getPublicArtifact);
router.get('/search', searchPublicArtifacts);

export default router;
