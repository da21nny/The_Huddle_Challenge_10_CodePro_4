const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Bloquear después de 5 intentos fallidos desde una misma IP
    message: 'Demasiados intentos de inicio de sesión desde esta IP, inténtalo de nuevo después de 15 minutos.'
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Límite general para evitar DoS simple
    message: 'Has excedido el límite de peticiones.'
});

module.exports = { loginRateLimiter, generalLimiter };
