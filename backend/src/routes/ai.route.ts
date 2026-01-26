import express from 'express';
import { recommendPerfumes } from '../controllers/ai.controller';

const router = express.Router();

router.post('/recommend', recommendPerfumes);

export default router;
