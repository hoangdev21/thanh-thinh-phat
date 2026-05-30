import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// GET /api/products — Get all products (with filters & pagination)
router.get('/', ProductController.getAllProducts);

// GET /api/products/featured — Get featured products (MUST be before /:slug)
router.get('/featured', ProductController.getFeaturedProducts);

// GET /api/products/:slug — Get single product by slug
router.get('/:slug', ProductController.getProductBySlug);

export default router;
