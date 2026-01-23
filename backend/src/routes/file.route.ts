import { Router } from 'express';
import { sample, uploadImages } from '../controllers/files.controller';
import uploadFields from '../middlewares/upload.middleware';

const router = Router();

router.post('/upload', uploadFields, uploadImages);

router.post('/sample', sample);

export default router;