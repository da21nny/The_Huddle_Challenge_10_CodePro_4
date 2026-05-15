const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { csrfGenerator } = require('../middlewares/csrfMiddleware');
const User = require('../models/User');

const router = express.Router();

// Rutas Públicas
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', csrfGenerator, (req, res) => {
    res.render('login', { layout: 'main' });
});

router.get('/register', csrfGenerator, (req, res) => {
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

module.exports = router;
