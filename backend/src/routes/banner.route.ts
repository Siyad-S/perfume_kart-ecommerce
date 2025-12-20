import { Router } from 'express';
import {
  create,
  list,
  update,
  banner,
  deleteBanner
} from '../controllers/banner.controller';
const router = Router();

router.post('/create', create);
router.post('/list', list);
router.get('/:id', banner);
router.put("/update/:id", update);
router.put("/delete/:id", deleteBanner);

export default router;