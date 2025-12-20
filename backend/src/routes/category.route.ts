import { Router } from 'express';
import {
    create,
    // category,
    deleteCategory,
    getMegaMenu,
    list,
    update
} from '../controllers/category.controller';
const router = Router();

router.post('/create', create);
router.post('/list', list);
router.put('/update/:id', update);
router.put('/delete/:id', deleteCategory);
router.get('/mega-menu', getMegaMenu);

export default router;