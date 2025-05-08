import { Router } from 'express';
import { searchController } from '../controllers/search.controller';

const router = Router();

router.post('/', searchController.searchFragrances);
router.post('/select', searchController.selectFragrance);

export default router;