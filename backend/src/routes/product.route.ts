import { Router } from 'express';
import {
  createProduct,
  list,
  updateProduct,
  deleteProduct,
  product,
  globalSearch,
} from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, productListSchema, productIdSchema, updateProductSchema } from '../validations/product.validation';

const router = Router();

router.post('/create', validate(createProductSchema), createProduct);
router.post('/list', validate(productListSchema), list);
router.get('/:id', validate(productIdSchema), product);
router.put('/update/:id', validate(updateProductSchema), updateProduct);
router.put('/delete/:id', validate(productIdSchema), deleteProduct);
router.post('/global-search', validate(productListSchema), globalSearch);

export default router;
