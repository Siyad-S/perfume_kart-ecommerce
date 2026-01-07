import { Router } from 'express';
import {
  create,
  deleteBrand,
  list,
  update
} from '../controllers/brand.controller';
import { validate } from '../middlewares/validate.middleware';
import { createBrandSchema, brandListSchema, updateBrandSchema, brandIdSchema } from '../validations/brand.validation';

const router = Router();

router.post('/create', validate(createBrandSchema), create);
router.post('/list', validate(brandListSchema), list);
router.put("/update/:id", validate(updateBrandSchema), update);
router.put("/delete/:id", validate(brandIdSchema), deleteBrand);

export default router;