import { Router } from 'express';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../controllers/categoryController.js';

const router = Router();
router.route('/').get(listCategories).post(createCategory);
router.route('/:id').put(updateCategory).delete(deleteCategory);
export default router;
