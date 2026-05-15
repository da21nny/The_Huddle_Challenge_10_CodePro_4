import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { csrfValidator } from '../middlewares/csrfMiddleware.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', csrfValidator, register);
router.post('/login', loginRateLimiter, csrfValidator, login);
router.post('/logout', csrfValidator, logout);

export default router;
