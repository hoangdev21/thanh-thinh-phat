import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

// Protect all routes in this router with authenticateAdmin
router.use(authenticateAdmin);

// GET /api/admin/stats — Get dashboard overview statistics
router.get('/stats', AdminController.getStats);

// GET /api/admin/contacts — List all client contact requests
router.get('/contacts', AdminController.getContacts);

// PUT /api/admin/contacts/:id — Update contact request status (new, contacted, done)
router.put('/contacts/:id', AdminController.updateContactStatus);

// POST /api/admin/products — Create new product (supports image upload)
router.post('/products', upload.single('image'), AdminController.createProduct);

// POST /api/admin/upload — Instant upload single file to Cloudinary
router.post('/upload', upload.single('image'), AdminController.uploadFile);

// PUT /api/admin/products/:id — Update product info (supports image upload)
router.put('/products/:id', upload.single('image'), AdminController.updateProduct);

// DELETE /api/admin/products/:id — Delete a product
router.delete('/products/:id', AdminController.deleteProduct);

export default router;
