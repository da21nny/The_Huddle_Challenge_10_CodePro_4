import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = Router();

router.get('/dashboard', authenticate, dashboardController.showDashboard);

export default router;
