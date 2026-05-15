const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { csrfValidator } = require('../middlewares/csrfMiddleware');
const { loginRateLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/register', csrfValidator, register);
router.post('/login', loginRateLimiter, csrfValidator, login);
router.post('/logout', csrfValidator, logout);

module.exports = router;
