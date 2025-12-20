import { Router } from 'express';
import {
  create,
  deleteBrand,
  list,
  update
} from '../controllers/brand.controller';
const router = Router();

router.post('/create', create);
router.post('/list', list);
router.put("/update/:id", update);
router.put("/delete/:id", deleteBrand);

export default router;