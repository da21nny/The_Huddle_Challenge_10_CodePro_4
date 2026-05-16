import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.get('/admin', authenticate, requireRole('admin'), adminController.showAdminPanel);
router.post('/admin/delete', authenticate, requireRole('admin'), adminController.deleteUser);

export default router;
