import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

// GET /api/categories — Get all categories
router.get('/', CategoryController.getAllCategories);

// GET /api/categories/:slug — Get category by slug
router.get('/:slug', CategoryController.getCategoryBySlug);

export default router;
