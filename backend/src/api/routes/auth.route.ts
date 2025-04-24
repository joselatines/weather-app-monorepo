import express from 'express';
import { register, login, getMe, authIndex } from '../controllers/auth.controller';
import { authenticate } from '../../middlewares'; // We'll create this middleware next

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require valid JWT)
router.get('/me', authenticate, getMe);

// Base route (optional)
router.get('/', authIndex);

export default router;
