import { Router } from 'express';
import {
  createProduct,
  list,
  updateProduct,
  deleteProduct,
  product,
  globalSearch,
} from '../controllers/product.controller';
const router = Router();

router.post('/create', createProduct);
router.post('/list', list);
router.get('/:id', product);
router.put('/update/:id', updateProduct);
router.put('/delete/:id', deleteProduct);
router.post('/global-search', globalSearch);

export default router;
