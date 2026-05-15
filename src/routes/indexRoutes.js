import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Rutas Públicas
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login', { layout: 'main' });
});

router.get('/register', (req, res) => {
    res.render('register', { layout: 'main' });
});

// Rutas Privadas (Requieren Autenticación)
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', { layout: 'main' });
});

// Rutas de Administrador (Requieren Autenticación y Rol Admin)
router.get('/admin', requireAuth, requireRole('Administrador'), async (req, res) => {
    const allUsers = await User.getAll();
    res.render('admin', { layout: 'main', users: allUsers });
});

export default router;
