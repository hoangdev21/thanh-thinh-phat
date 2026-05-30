import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();

// POST /api/contact — Create a new contact request
router.post('/', ContactController.createContact);

export default router;
