import { Router } from 'express';
import {
    create,
    deleteCategory,
    getMegaMenu,
    list,
    update
} from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema, categoryListSchema, updateCategorySchema, categoryIdSchema } from '../validations/category.validation';

const router = Router();

router.post('/create', validate(createCategorySchema), create);
router.post('/list', validate(categoryListSchema), list);
router.put('/update/:id', validate(updateCategorySchema), update);
router.put('/delete/:id', validate(categoryIdSchema), deleteCategory);
router.get('/mega-menu', getMegaMenu);

export default router;