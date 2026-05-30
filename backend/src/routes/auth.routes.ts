import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// POST /api/auth/login — Admin login
router.post('/login', AuthController.login);

// GET /api/auth/me — Validate session & get profile info
router.get('/me', authenticateAdmin, AuthController.me);

export default router;
