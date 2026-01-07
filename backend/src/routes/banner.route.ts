import { Router } from 'express';
import {
  create,
  list,
  update,
  banner,
  deleteBanner
} from '../controllers/banner.controller';
import { validate } from '../middlewares/validate.middleware';
import { createBannerSchema, bannerListSchema, updateBannerSchema, bannerIdSchema } from '../validations/banner.validation';

const router = Router();

router.post('/create', validate(createBannerSchema), create);
router.post('/list', validate(bannerListSchema), list);
router.get('/:id', validate(bannerIdSchema), banner);
router.put("/update/:id", validate(updateBannerSchema), update);
router.put("/delete/:id", validate(bannerIdSchema), deleteBanner);

export default router;