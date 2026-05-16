import { Router } from 'express';
import { checkRateLimit } from '../middlewares/rateLimiter.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/login', authController.showLogin);
router.post('/login', checkRateLimit, authController.login);
router.post('/logout', authController.logout);

export default router;
